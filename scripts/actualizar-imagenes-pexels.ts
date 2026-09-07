// Uso: npx tsx scripts/actualizar-imagenes-pexels.ts
//
// Reemplaza el imagenUrl (placeholder) de cada producto por una foto real
// de Pexels, buscada a partir de su nombre.
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";
const RESULTADOS_POR_BUSQUEDA = 10;
const PAUSA_ENTRE_LLAMADAS_MS = 300;

// La búsqueda de Pexels funciona mucho mejor en inglés que en español.
// Frases de más de una palabra se traducen antes de partir el texto en
// palabras sueltas, para no perder expresiones que no son literales
// (p.ej. "a cuadros" -> "plaid", no "to squares").
const FRASES: [string, string][] = [
  ["a cuadros", "plaid"],
  ["manga larga", "long sleeve"],
  ["cuello redondo", "crew neck"],
  ["tiro alto", "high waist"],
  ["cintura alta", "high waist"],
  ["con cable", "wired"],
  ["resistentes al agua", "waterproof"],
  ["resistente al agua", "waterproof"],
  ["cancelación de ruido", "noise cancelling"],
  ["para correr", "running"],
  ["con gancho", "ear hook"],
  ["suela de goma", "rubber sole"],
  ["lentes de sol", "sunglasses"],
];

// Vocabulario específico del catálogo (ropa, calzado, accesorios,
// electrodomésticos). Palabras no listadas pasan sin traducir: nombres de
// marca, números, o términos que ya son válidos en inglés (in-ear, TWS...).
const PALABRAS: Record<string, string> = {
  polo: "polo shirt",
  camisa: "shirt",
  pantalón: "pants",
  jean: "jeans",
  casaca: "jacket",
  cortavientos: "windbreaker",
  short: "shorts",
  deportivo: "sport",
  deportiva: "sport",
  deportivos: "sport",
  deportivas: "sport",
  sweater: "sweater",
  blusa: "blouse",
  vestido: "dress",
  casual: "casual",
  verano: "summer",
  chompa: "sweater",
  oversize: "oversized",
  leggings: "leggings",
  mujer: "women",
  chaqueta: "jacket",
  denim: "denim",
  estampado: "printed",
  niño: "kids",
  niña: "kids",
  niños: "kids",
  conjunto: "tracksuit",
  impermeable: "waterproof",
  audífonos: "headphones",
  inalámbricos: "wireless",
  inalámbrica: "wireless",
  inalámbrico: "wireless",
  gamer: "gaming",
  micrófono: "microphone",
  mini: "mini",
  diadema: "headphones",
  plegable: "foldable",
  tws: "wireless earbuds",
  zapatillas: "sneakers",
  urbanas: "urban",
  urbana: "urban",
  urbano: "urban",
  running: "running",
  botines: "ankle boots",
  cuero: "leather",
  zapatos: "shoes",
  formales: "formal",
  sandalias: "sandals",
  botas: "boots",
  skate: "skateboard",
  unisex: "unisex",
  mocasines: "loafers",
  mochila: "backpack",
  antirrobo: "anti-theft",
  reloj: "watch",
  analógico: "analog",
  clásico: "classic",
  sol: "sun",
  polarizados: "polarized",
  gorra: "cap",
  snapback: "snapback cap",
  billetera: "wallet",
  hombre: "men",
  cinturón: "belt",
  reversible: "reversible",
  laptop: "laptop",
  digital: "digital",
  bufanda: "scarf",
  lana: "wool",
  riñonera: "fanny pack",
  licuadora: "blender",
  vaso: "glass",
  sanguichera: "sandwich maker",
  eléctrica: "electric",
  eléctrico: "electric",
  plancha: "iron",
  vapor: "steam",
  hervidor: "kettle",
  cafetera: "coffee maker",
  goteo: "drip",
  aspiradora: "vacuum cleaner",
  mano: "hand",
  ventilador: "fan",
  torre: "tower",
  tostadora: "toaster",
  rebanadas: "toast",
  batidora: "hand mixer",
  purificador: "air purifier",
  aire: "air",
  compacto: "compact",
  básico: "basic",
  básica: "basic",
  algodón: "cotton",
};

// Preposiciones que sobreviven a la traducción de frases (p.ej. "Botines
// de cuero mujer") y que no aportan nada a una búsqueda en inglés.
const STOPWORDS = new Set(["a", "al", "con", "de", "para"]);

function traducir(nombre: string): string {
  let texto = nombre.toLowerCase();
  for (const [es, en] of FRASES) {
    texto = texto.replaceAll(es, en);
  }

  return texto
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => palabra.replace(/[,()]/g, ""))
    .map((palabra) => PALABRAS[palabra] ?? palabra)
    .filter((palabra) => !STOPWORDS.has(palabra))
    .join(" ");
}

type FotoPexels = { id: number; src: { large: string } };
type RespuestaBusqueda = { photos: FotoPexels[] };

async function buscarFoto(
  query: string,
  usados: Set<number>
): Promise<{ foto?: FotoPexels; duplicada?: boolean }> {
  const url = `${PEXELS_SEARCH_URL}?query=${encodeURIComponent(query)}&per_page=${RESULTADOS_POR_BUSQUEDA}`;

  const respuesta = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY! },
  });

  if (!respuesta.ok) {
    throw new Error(`Pexels respondió ${respuesta.status} para "${query}"`);
  }

  const datos = (await respuesta.json()) as RespuestaBusqueda;
  if (datos.photos.length === 0) {
    return {};
  }

  const disponible = datos.photos.find((foto) => !usados.has(foto.id));
  if (disponible) {
    return { foto: disponible };
  }

  // Las 10 opciones ya se usaron en otros productos: se acepta una
  // repetida como último recurso, mejor que dejar el placeholder.
  return { foto: datos.photos[0], duplicada: true };
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!PEXELS_API_KEY) {
    console.error("Falta PEXELS_API_KEY en las variables de entorno.");
    process.exitCode = 1;
    return;
  }

  const productos = await prisma.producto.findMany({ orderBy: { id: "asc" } });
  console.log(`Buscando fotos para ${productos.length} productos...\n`);

  const usados = new Set<number>();
  let actualizados = 0;
  let duplicados = 0;
  let sinResultados = 0;

  for (const producto of productos) {
    const query = traducir(producto.nombre);

    try {
      const resultado = await buscarFoto(query, usados);

      if (!resultado.foto) {
        console.log(`✗ #${producto.id} "${producto.nombre}" — sin resultados para "${query}"`);
        sinResultados++;
      } else {
        usados.add(resultado.foto.id);
        await prisma.producto.update({
          where: { id: producto.id },
          data: { imagenUrl: resultado.foto.src.large },
        });

        if (resultado.duplicada) {
          console.log(`⚠ #${producto.id} "${producto.nombre}" — foto repetida (query: "${query}")`);
          duplicados++;
        } else {
          console.log(`✓ #${producto.id} "${producto.nombre}" — actualizado (query: "${query}")`);
          actualizados++;
        }
      }
    } catch (error) {
      console.log(`✗ #${producto.id} "${producto.nombre}" — error: ${(error as Error).message}`);
      sinResultados++;
    }

    await esperar(PAUSA_ENTRE_LLAMADAS_MS);
  }

  console.log("\n--- Resumen ---");
  console.log(`Actualizados con foto única:    ${actualizados}`);
  console.log(`Actualizados con foto repetida: ${duplicados}`);
  console.log(`Sin resultados (sin cambios):   ${sinResultados}`);
  console.log(`Total:                          ${productos.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
