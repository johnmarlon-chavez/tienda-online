"use server";

import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/session";

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

  let usuarioId: number;
  try {
    const usuario = await prisma.usuario.create({
      data: { nombre, email, passwordHash: hashPassword(password) },
    });
    usuarioId = usuario.id;
  } catch {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  await crearSesion(usuarioId);
  redirect("/perfil");
}
