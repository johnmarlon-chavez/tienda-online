import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const DURACION_HORAS = 24;
const COOLDOWN_SEGUNDOS = 60;

export async function crearTokenVerificacion(
  usuarioId: number
): Promise<{ token?: string; error?: string }> {
  const ultimoToken = await prisma.tokenVerificacion.findFirst({
    where: { usuarioId },
    orderBy: { creadoEn: "desc" },
  });

  if (ultimoToken) {
    const segundosDesdeUltimoEnvio =
      (Date.now() - ultimoToken.creadoEn.getTime()) / 1000;
    if (segundosDesdeUltimoEnvio < COOLDOWN_SEGUNDOS) {
      return { error: "Espera un momento antes de solicitar otro correo de verificación." };
    }
  }

  await prisma.tokenVerificacion.deleteMany({ where: { usuarioId } });

  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + DURACION_HORAS * 60 * 60 * 1000);
  await prisma.tokenVerificacion.create({ data: { token, usuarioId, expiraEn } });

  return { token };
}
