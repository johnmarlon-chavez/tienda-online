import { NextResponse } from "next/server";
import type { Content } from "@google/genai";
import { responderChat, type CartItemChat } from "@/lib/gemini";
import { obtenerUsuarioActual } from "@/lib/session";

type CuerpoPeticion = {
  mensaje?: unknown;
  historial?: unknown;
  historialUsuarioId?: unknown;
  carrito?: unknown;
};

export async function POST(request: Request) {
  // La identidad del usuario viene únicamente de la cookie de sesión
  // httpOnly (el mismo mecanismo que protege /perfil y /checkout) — nunca
  // de nada que mande el cliente en el cuerpo de la petición.
  const usuario = await obtenerUsuarioActual();
  const usuarioId = usuario?.id ?? null;

  const cuerpo = (await request.json().catch(() => null)) as CuerpoPeticion | null;
  const mensaje = String(cuerpo?.mensaje ?? "").trim();
  if (!mensaje) {
    return NextResponse.json({ error: "Escribe un mensaje." }, { status: 400 });
  }
  if (mensaje.length > 1000) {
    return NextResponse.json({ error: "Mensaje demasiado largo." }, { status: 400 });
  }

  // El cliente manda con qué usuario (o null si no había sesión) se generó
  // su historial guardado. Si no coincide con la sesión actual —logout,
  // login, o cambio de cuenta desde el último mensaje— se descarta: el
  // modelo nunca debe seguir una conversación armada bajo otra identidad,
  // sin importar si el widget del navegador falló en limpiar su propio
  // estado visible.
  const historialUsuarioIdCliente =
    typeof cuerpo?.historialUsuarioId === "number" ? cuerpo.historialUsuarioId : null;
  const historialConfiable =
    historialUsuarioIdCliente === usuarioId && Array.isArray(cuerpo?.historial)
      ? (cuerpo.historial as Content[])
      : [];

  const carrito = Array.isArray(cuerpo?.carrito) ? (cuerpo.carrito as CartItemChat[]) : [];

  try {
    const { reply, history, productos } = await responderChat(mensaje, historialConfiable, usuario, carrito);
    return NextResponse.json({ reply, history, usuarioId, productos });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { error: "No pude responder en este momento. Intenta de nuevo en un momento." },
      { status: 502 }
    );
  }
}
