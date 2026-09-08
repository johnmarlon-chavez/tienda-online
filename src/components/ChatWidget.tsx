"use client";

import type { Content } from "@google/genai";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatProductCard from "@/components/ChatProductCard";
import { useCart } from "@/context/CartContext";
import type { ProductoChat } from "@/lib/gemini";

type MensajeVisible = { rol: "user" | "bot"; texto: string; productos?: ProductoChat[] };

const MENSAJE_BIENVENIDA: MensajeVisible = {
  rol: "bot",
  texto: "¡Hola! Soy el asistente de ANDES. Puedo ayudarte a encontrar productos, resolver dudas sobre la tienda, o revisar tu carrito y tus pedidos si tienes sesión iniciada. ¿En qué te ayudo?",
};

export default function ChatWidget({ usuarioId }: { usuarioId: number | null }) {
  const { items } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeVisible[]>([MENSAJE_BIENVENIDA]);
  const [historial, setHistorial] = useState<Content[]>([]);
  const [historialUsuarioId, setHistorialUsuarioId] = useState<number | null>(usuarioId);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, enviando]);

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    const mensaje = texto.trim();
    if (!mensaje || enviando) return;

    setMensajes((prev) => [...prev, { rol: "user", texto: mensaje }]);
    setTexto("");
    setError(null);
    setEnviando(true);

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje,
          historial,
          historialUsuarioId,
          carrito: items.map((item) => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.error ?? "No se pudo enviar el mensaje.");
        return;
      }

      setHistorial(datos.history ?? []);
      setHistorialUsuarioId(datos.usuarioId ?? null);
      setMensajes((prev) => [
        ...prev,
        { rol: "bot", texto: datos.reply, productos: datos.productos ?? [] },
      ]);
    } catch {
      setError("No se pudo conectar con el asistente. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-20 sm:right-6 sm:bottom-6">
      {abierto && (
        <div className="mb-3 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-4 py-3 text-white">
            <span className="text-sm font-semibold">Asistente ANDES</span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
              className="text-zinc-300 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {mensajes.map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className={`flex ${m.rol === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.rol === "user"
                        ? "bg-accent text-white"
                        : "bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    {m.texto}
                  </p>
                </div>
                {m.productos && m.productos.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {m.productos.map((producto) => (
                      <ChatProductCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {enviando && (
              <div className="flex justify-start">
                <p className="max-w-[85%] rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-500">
                  Escribiendo...
                </p>
              </div>
            )}
            {error && (
              <p className="text-center text-xs text-red-600">{error}</p>
            )}
            <div ref={finRef} />
          </div>

          <form onSubmit={enviarMensaje} className="flex items-center gap-2 border-t border-zinc-200 p-3">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta..."
              maxLength={1000}
              disabled={enviando}
              className="flex-1 rounded-full border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={enviando || !texto.trim()}
              aria-label="Enviar mensaje"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat de ayuda"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-colors hover:bg-accent-hover"
      >
        {abierto ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
