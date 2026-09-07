"use client";

import { useState, useTransition } from "react";
import { reenviarVerificacion } from "@/app/verificar-email/actions";

export default function ReenviarVerificacionBoton() {
  const [pending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  function handleClick() {
    setMensaje(null);
    startTransition(async () => {
      const resultado = await reenviarVerificacion();
      if (resultado.error) {
        setMensaje({ tipo: "error", texto: resultado.error });
      } else {
        setMensaje({ tipo: "ok", texto: "Te enviamos un nuevo correo de verificación." });
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="shrink-0 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Reenviar correo de verificación"}
      </button>
      {mensaje && (
        <p className={`text-xs ${mensaje.tipo === "ok" ? "text-green-700" : "text-red-600"}`}>
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}
