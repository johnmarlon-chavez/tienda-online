"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarProducto } from "@/app/admin/productos/actions";

export default function EliminarProductoBoton({
  id,
  nombre,
}: {
  id: number;
  nombre: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const resultado = await eliminarProducto(id);
      if (resultado.error) {
        setError(resultado.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-sm font-medium text-red-600 transition-colors hover:underline disabled:opacity-50"
      >
        {pending ? "Eliminando..." : "Eliminar"}
      </button>
      {error && <p className="mt-1 max-w-xs text-xs text-red-600">{error}</p>}
    </div>
  );
}
