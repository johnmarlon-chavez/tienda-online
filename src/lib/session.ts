import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "andes_sesion";
const DURACION_DIAS = 30;

export async function crearSesion(usuarioId: number) {
  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + DURACION_DIAS * 24 * 60 * 60 * 1000);

  await prisma.sesion.create({ data: { token, usuarioId, expiraEn } });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiraEn,
  });
}

export async function obtenerUsuarioActual() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const sesion = await prisma.sesion.findUnique({
    where: { token },
    include: { usuario: true },
  });

  if (!sesion) return null;

  if (sesion.expiraEn < new Date()) {
    await prisma.sesion.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return sesion.usuario;
}

// Se usa al inicio de cada página y Server Action de /admin: las Server
// Actions son un punto de entrada aparte del layout, así que necesitan su
// propio chequeo (un layout que solo "esconda" contenido no las protege).
export async function requireAdmin() {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) {
    redirect("/login");
  }
  if (usuario.rol !== "admin") {
    redirect("/acceso-denegado");
  }
  return usuario;
}

export async function cerrarSesion() {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await prisma.sesion.delete({ where: { token } }).catch(() => {});
  }
  cookieStore.delete(COOKIE_NAME);
}
