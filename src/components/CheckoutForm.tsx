"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { crearPedido } from "@/app/checkout/actions";
import { useCart } from "@/context/CartContext";
import { formatearPrecio } from "@/lib/format";

export default function CheckoutForm() {
  const { items, totalPrecio, clearCart } = useCart();
  const router = useRouter();

  const [direccion, setDireccion] = useState("");
  const [distrito, setDistrito] = useState("");
  const [referencia, setReferencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-zinc-500">
          Agrega productos antes de continuar con la compra.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Ver productos
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!direccion.trim() || !distrito.trim() || !telefono.trim()) {
      setError("Completa dirección, distrito/ciudad y teléfono.");
      return;
    }

    setError(null);
    setEnviando(true);

    const direccionCompleta = [
      `Dirección: ${direccion.trim()}`,
      `Distrito/Ciudad: ${distrito.trim()}`,
      referencia.trim() ? `Referencia: ${referencia.trim()}` : null,
      `Teléfono: ${telefono.trim()}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const resultado = await crearPedido({
      direccion: direccionCompleta,
      items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
    });

    if (resultado.error) {
      setEnviando(false);
      setError(resultado.error);
      return;
    }

    clearCart();
    router.push(`/checkout/confirmacion/${resultado.pedidoId}`);
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            Dirección de envío
          </h2>

          <div>
            <label
              htmlFor="direccion"
              className="block text-sm font-medium text-zinc-700"
            >
              Dirección (calle y número)
            </label>
            <input
              id="direccion"
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="distrito"
              className="block text-sm font-medium text-zinc-700"
            >
              Distrito / Ciudad
            </label>
            <input
              id="distrito"
              type="text"
              required
              value={distrito}
              onChange={(e) => setDistrito(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="referencia"
              className="block text-sm font-medium text-zinc-700"
            >
              Referencia (opcional)
            </label>
            <input
              id="referencia"
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-zinc-700"
            >
              Teléfono de contacto
            </label>
            <input
              id="telefono"
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="text-xs text-zinc-500">
            Esto es una simulación de compra: no se procesa ningún pago real.
          </p>

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {enviando ? "Procesando..." : "Confirmar pedido"}
          </button>
        </form>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Resumen del pedido
          </h2>
          <ul className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={item.imagenUrl}
                    alt={item.nombre}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.cantidad} × {formatearPrecio(item.precio)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-zinc-900">
                  {formatearPrecio(item.precio * item.cantidad)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
            <span className="text-base font-semibold text-zinc-900">
              Total
            </span>
            <span className="text-xl font-bold text-zinc-900">
              {formatearPrecio(totalPrecio)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
