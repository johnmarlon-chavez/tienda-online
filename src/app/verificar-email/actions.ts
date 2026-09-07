"use server";

import { enviarCorreoVerificacion } from "@/lib/email";
import { obtenerUsuarioActual } from "@/lib/session";
import { crearTokenVerificacion } from "@/lib/verificacion";

export async function reenviarVerificacion(): Promise<{ error?: string; ok?: boolean }> {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) {
    return { error: "Debes iniciar sesión." };
  }
  if (usuario.emailVerificado) {
    return { error: "Tu correo ya está verificado." };
  }

  const resultado = await crearTokenVerificacion(usuario.id);
  if (resultado.error || !resultado.token) {
    return { error: resultado.error ?? "No se pudo generar el enlace de verificación." };
  }

  const envio = await enviarCorreoVerificacion(usuario.email, usuario.nombre, resultado.token);
  if (envio.error) {
    return { error: "No se pudo enviar el correo. Intenta de nuevo más tarde." };
  }

  return { ok: true };
}
