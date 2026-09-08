import {
  GoogleGenAI,
  FunctionCallingConfigMode,
  type Content,
  type FunctionDeclaration,
} from "@google/genai";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { Usuario } from "@/generated/prisma/client";

// "flash-lite" da respuestas notablemente más rápidas y estables que el
// flash normal para este caso (verificado con pruebas reales) — un
// asistente de atención al cliente no necesita el modelo más grande, solo
// tool calling correcto y baja latencia. El alias "-latest" evita quedar
// atado a una versión puntual que Google puede discontinuar.
const MODELO = "gemini-flash-lite-latest";
const MAX_ITERACIONES_TOOLS = 4;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type CartItemChat = { nombre: string; cantidad: number; precio: number };

// Lo que necesita el widget para dibujar una tarjeta de producto y poder
// agregarlo al carrito (mismo shape que espera AddToCartButton).
export type ProductoChat = {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  marca: string | null;
};

const buscarProductosDeclaracion: FunctionDeclaration = {
  name: "buscar_productos",
  description:
    "Busca productos reales en el catálogo de la tienda por nombre, marca o categoría. Úsala siempre que el usuario pregunte por un producto específico o un tipo de producto — nunca inventes productos ni precios.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Palabra clave a buscar, por ejemplo \"audífonos Sony\" o \"zapatillas running\".",
      },
    },
    required: ["query"],
  },
};

const verMisPedidosDeclaracion: FunctionDeclaration = {
  name: "ver_mis_pedidos",
  description:
    "Devuelve el historial de pedidos del usuario que está hablando en este chat, con su estado, total y fecha. Solo funciona si hay una sesión iniciada.",
  parametersJsonSchema: {
    type: "object",
    properties: {},
  },
};

// Prisma/Postgres "contains" + mode:"insensitive" solo ignora mayúsculas,
// no tildes: buscar "audifonos" (el modelo no siempre escribe el acento)
// nunca hace match contra "Audífonos" en la base. Se normaliza quitando
// diacríticos en ambos lados y se compara en JS — el catálogo es chico
// (decenas de productos), así que traerlo completo y filtrar en memoria
// es más simple y confiable que depender de una extensión de Postgres.
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase();
}

// Devuelve dos vistas del mismo resultado: "paraModelo" es lo que se le
// manda a Gemini como functionResponse (precio ya formateado, texto que
// puede citar tal cual); "paraCliente" es la data cruda que el widget
// necesita para dibujar tarjetas y agregar al carrito (precio numérico,
// imagenUrl). Nunca se re-deriva una de la otra vía el texto del modelo.
async function ejecutarBuscarProductos(
  args: Record<string, unknown>
): Promise<{ paraModelo: Record<string, unknown>; paraCliente: ProductoChat[] }> {
  const query = String(args.query ?? "").trim();
  if (!query) return { paraModelo: { resultados: [] }, paraCliente: [] };

  const palabras = normalizar(query).split(/\s+/).filter(Boolean);

  const productos = await prisma.producto.findMany({ orderBy: { nombre: "asc" } });

  const coincidencias = productos
    .filter((p) => {
      const textoBusqueda = normalizar(
        [p.nombre, p.marca, p.categoria, p.subcategoria, p.descripcion]
          .filter((campo): campo is string => Boolean(campo))
          .join(" ")
      );
      return palabras.every((palabra) => textoBusqueda.includes(palabra));
    })
    .slice(0, 8);

  return {
    paraModelo: {
      resultados: coincidencias.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        marca: p.marca,
        categoria: p.categoria,
        subcategoria: p.subcategoria,
        precio: formatearPrecio(p.precio),
        stock: p.stock,
      })),
    },
    paraCliente: coincidencias.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagenUrl: p.imagenUrl,
      marca: p.marca,
    })),
  };
}

// usuarioId siempre viene de la sesión ya verificada en la ruta (la misma
// que protege /perfil y /checkout) — jamás de un argumento del modelo. Esta
// función ni siquiera recibe argumentos del tool call, a propósito.
async function ejecutarVerMisPedidos(usuarioId: number) {
  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId },
    include: { items: { include: { producto: true } } },
    orderBy: { creadoEn: "desc" },
    take: 10,
  });

  return {
    pedidos: pedidos.map((pedido) => ({
      id: pedido.id,
      estado: pedido.estado,
      total: formatearPrecio(pedido.total),
      fecha: pedido.creadoEn.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      items: pedido.items.map((item) => ({
        producto: item.producto.nombre,
        cantidad: item.cantidad,
      })),
    })),
  };
}

async function construirInstruccionSistema(
  usuario: Usuario | null,
  carrito: CartItemChat[]
): Promise<string> {
  const categoriasRaw = await prisma.producto.findMany({
    distinct: ["categoria"],
    select: { categoria: true },
    orderBy: { categoria: "asc" },
  });
  const categorias = categoriasRaw.map((c) => c.categoria).join(", ");

  const partes = [
    `Eres el asistente de atención al cliente de ANDES, una tienda online de ${categorias}. Responde en español, de forma breve y amable.`,
    `Cómo funciona la tienda: los usuarios navegan el catálogo, agregan productos al carrito, y para completar una compra necesitan una cuenta con el correo verificado (se envía un enlace de verificación al registrarse). El checkout es una simulación de portfolio: no se procesa ningún pago real. No existe un sistema formal de devoluciones todavía — si te preguntan, dilo con honestidad en vez de inventar una política.`,
    `Para preguntas sobre productos específicos (si tienen algo, precios, marcas disponibles), usa siempre la herramienta buscar_productos en vez de inventar resultados. Si no encuentra nada, dilo claramente.`,
    `Cuando buscar_productos encuentre resultados, tu respuesta de texto NO debe repetirlos en una lista con nombre y precio de cada uno — esos datos ya se muestran aparte, en tarjetas visuales con foto, nombre y precio justo debajo de tu mensaje. Escribe solo una frase breve y conversacional (cuántos encontraste, o qué los distingue), como "Encontré estas opciones:" o "Tenemos 2 modelos de esos, míralos abajo". Nunca vuelvas a escribir el nombre exacto ni el precio exacto de cada producto en el texto.`,
    `Nunca reveles ni asumas datos de otros usuarios: la única información de cuenta que puedes usar es la del usuario que te está hablando en este chat, provista explícitamente abajo o mediante tus herramientas.`,
  ];

  if (usuario) {
    partes.push(
      `El usuario tiene sesión iniciada como "${usuario.nombre}". Puedes usar la herramienta ver_mis_pedidos si pregunta por sus pedidos.`
    );
    if (carrito.length > 0) {
      const resumen = carrito
        .map((item) => `${item.cantidad}x ${item.nombre} (${formatearPrecio(item.precio)} c/u)`)
        .join("; ");
      partes.push(`Carrito actual del usuario: ${resumen}.`);
    } else {
      partes.push(`El carrito del usuario está vacío en este momento.`);
    }
  } else {
    partes.push(
      `El usuario NO tiene sesión iniciada. Puedes ayudarlo con productos y preguntas generales, pero si pregunta por su carrito o sus pedidos, dile claramente que necesita iniciar sesión primero.`
    );
  }

  return partes.join("\n\n");
}

export type MensajeChat = { reply: string; history: Content[]; productos: ProductoChat[] };

export async function responderChat(
  mensaje: string,
  historialPrevio: Content[],
  usuario: Usuario | null,
  carrito: CartItemChat[]
): Promise<MensajeChat> {
  const systemInstruction = await construirInstruccionSistema(usuario, carrito);

  const functionDeclarations = [buscarProductosDeclaracion];
  if (usuario) {
    functionDeclarations.push(verMisPedidosDeclaracion);
  }

  const contents: Content[] = [
    ...historialPrevio,
    { role: "user", parts: [{ text: mensaje }] },
  ];

  // Productos vistos por buscar_productos en cualquier iteración de este
  // turno, para devolverlos estructurados al widget (deduplicados por id
  // por si el modelo busca más de una vez).
  const productosPorId = new Map<number, ProductoChat>();

  for (let intento = 0; intento < MAX_ITERACIONES_TOOLS; intento++) {
    const respuesta = await ai.models.generateContent({
      model: MODELO,
      contents,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations }],
        toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } },
      },
    });

    const llamadas = respuesta.functionCalls;
    if (!llamadas || llamadas.length === 0) {
      return {
        reply: respuesta.text ?? "No pude generar una respuesta.",
        history: contents,
        productos: [...productosPorId.values()],
      };
    }

    contents.push(respuesta.candidates![0].content!);

    const partesRespuesta = await Promise.all(
      llamadas.map(async (llamada) => {
        let resultado: unknown;
        if (llamada.name === "buscar_productos") {
          const { paraModelo, paraCliente } = await ejecutarBuscarProductos(llamada.args ?? {});
          for (const producto of paraCliente) {
            productosPorId.set(producto.id, producto);
          }
          resultado = paraModelo;
        } else if (llamada.name === "ver_mis_pedidos" && usuario) {
          resultado = await ejecutarVerMisPedidos(usuario.id);
        } else {
          resultado = { error: "Herramienta no disponible." };
        }
        return {
          functionResponse: {
            name: llamada.name,
            response: resultado as Record<string, unknown>,
          },
        };
      })
    );

    contents.push({ role: "user", parts: partesRespuesta });
  }

  return {
    reply: "Tengo demasiadas cosas que revisar para responder eso ahora mismo — ¿puedes reformular la pregunta?",
    history: contents,
    productos: [...productosPorId.values()],
  };
}
