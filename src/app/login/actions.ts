"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/session";

export type EstadoFormulario = { error?: string };

export async function iniciarSesion(
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completa todos los campos." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !verifyPassword(password, usuario.passwordHash)) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await crearSesion(usuario.id);
  redirect("/perfil");
}
