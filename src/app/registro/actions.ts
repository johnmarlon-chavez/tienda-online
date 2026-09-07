"use server";

import { redirect } from "next/navigation";
import { enviarCorreoVerificacion } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/session";
import { crearTokenVerificacion } from "@/lib/verificacion";

export type EstadoFormulario = { error?: string };

export async function registrarUsuario(
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email || !password) {
    return { error: "Completa todos los campos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  let usuario;
  try {
    usuario = await prisma.usuario.create({
      data: { nombre, email, passwordHash: hashPassword(password) },
    });
  } catch {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  // Si el envío falla (p.ej. límites de Resend en modo de pruebas), la
  // cuenta igual queda creada: el usuario puede reenviar el correo después.
  const { token } = await crearTokenVerificacion(usuario.id);
  if (token) {
    await enviarCorreoVerificacion(usuario.email, usuario.nombre, token).catch(() => {});
  }

  await crearSesion(usuario.id);
  redirect("/perfil");
}
