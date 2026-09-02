"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatearPrecio } from "@/lib/format";

export default function CarritoPage() {
  const { items, totalPrecio, incrementItem, decrementItem, removeItem } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-zinc-500">
          Agrega productos desde el catálogo para verlos aquí.
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

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Carrito
      </h1>

      <ul className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <Link
              href={`/productos/${item.id}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100"
            >
              <Image
                src={item.imagenUrl}
                alt={item.nombre}
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/productos/${item.id}`}
                className="line-clamp-2 text-sm font-medium text-zinc-900 hover:underline"
              >
                {item.nombre}
              </Link>
              <p className="mt-1 text-sm text-zinc-500">
                {formatearPrecio(item.precio)} c/u
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="mt-2 text-xs font-medium text-zinc-500 underline-offset-2 hover:text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decrementItem(item.id)}
                disabled={item.cantidad <= 1}
                aria-label="Disminuir cantidad"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-zinc-900">
                {item.cantidad}
              </span>
              <button
                type="button"
                onClick={() => incrementItem(item.id)}
                aria-label="Aumentar cantidad"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900"
              >
                +
              </button>
            </div>

            <p className="w-24 shrink-0 text-right text-sm font-semibold text-zinc-900">
              {formatearPrecio(item.precio * item.cantidad)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-6">
        <span className="text-lg font-semibold text-zinc-900">Total</span>
        <span className="text-2xl font-bold text-zinc-900">
          {formatearPrecio(totalPrecio)}
        </span>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          href="/productos"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Seguir comprando
        </Link>
      </div>
    </main>
  );
}
