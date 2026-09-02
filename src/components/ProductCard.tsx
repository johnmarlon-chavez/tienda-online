import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/generated/prisma/client";
import AddToCartButton from "@/components/AddToCartButton";
import { formatearPrecio } from "@/lib/format";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/productos/${producto.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          <Image
            src={producto.imagenUrl}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4 pb-0">
          {producto.marca && (
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {producto.marca}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-900">
            {producto.nombre}
          </h3>
          <p className="mt-auto pt-2 text-base font-semibold text-zinc-900">
            {formatearPrecio(producto.precio)}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-3">
        <AddToCartButton
          producto={{
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagenUrl: producto.imagenUrl,
          }}
          className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-900"
        />
      </div>
    </div>
  );
}
