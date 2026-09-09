// Acceso a la base de datos para preparar y limpiar datos de los tests E2E.
// Usa SQL crudo vía @neondatabase/serverless en vez del cliente generado de
// Prisma: ese cliente es ESM (usa import.meta.url internamente para un
// shim de __dirname), algo que Next.js resuelve sin problema pero que el
// cargador de TypeScript de Playwright no soporta fuera de un proyecto
// configurado como ESM. En vez de tocar la configuración de módulos de
// todo el proyecto solo por los tests, este helper es autosuficiente: solo
// necesita insertar/borrar unas pocas filas en tablas conocidas.
import "dotenv/config";
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "../../src/lib/password";

const sql = neon(process.env.DATABASE_URL!);

// Dominio reservado (RFC 2606) que nunca es un dominio real registrable —
// así se puede identificar y borrar todo lo que crean los tests sin riesgo
// de tocar jamás una cuenta de un usuario de verdad.
const DOMINIO_PRUEBA = "@playwright.test";
const NOMBRE_COOKIE_SESION = "andes_sesion";

export function correoDePrueba(prefijo: string): string {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 100000)}${DOMINIO_PRUEBA}`;
}

export async function crearUsuarioVerificado(opciones: {
  nombre: string;
  email: string;
  password: string;
}): Promise<{ id: number }> {
  const [usuario] = await sql`
    INSERT INTO "Usuario" (nombre, email, "passwordHash", "emailVerificado")
    VALUES (${opciones.nombre}, ${opciones.email}, ${hashPassword(opciones.password)}, true)
    RETURNING id
  `;
  return usuario as { id: number };
}

// Crea una sesión real en la base (igual que crearSesion en src/lib/session.ts)
// y devuelve la cookie lista para inyectar con context.addCookies(), evitando
// tener que pasar por el formulario de login para pruebas que no están
// evaluando el login en sí.
export async function crearCookieDeSesion(usuarioId: number, baseURL: string) {
  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO "Sesion" (token, "usuarioId", "expiraEn")
    VALUES (${token}, ${usuarioId}, ${expiraEn.toISOString()})
  `;

  return {
    name: NOMBRE_COOKIE_SESION,
    value: token,
    url: baseURL,
    httpOnly: true,
    sameSite: "Lax" as const,
  };
}

export async function limpiarDatosDePrueba() {
  const usuarios = (await sql`
    SELECT id FROM "Usuario" WHERE email LIKE ${"%" + DOMINIO_PRUEBA}
  `) as { id: number }[];
  const ids = usuarios.map((u) => u.id);
  if (ids.length === 0) return;

  // Pedido -> Usuario no tiene onDelete: Cascade (a propósito, en la app
  // real no se debería poder borrar un usuario con pedidos), así que se
  // borran los pedidos primero. Eso cascadea a DetalleOrden. Borrar el
  // usuario después cascadea Sesion y TokenVerificacion.
  await sql`DELETE FROM "Pedido" WHERE "usuarioId" = ANY(${ids})`;
  await sql`DELETE FROM "Usuario" WHERE id = ANY(${ids})`;
}
