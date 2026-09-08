import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { formatearPrecio } from "@/lib/format";
import type { ProductoChat } from "@/lib/gemini";

export default function ChatProductCard({ producto }: { producto: ProductoChat }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2">
      <Link
        href={`/productos/${producto.id}`}
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100"
      >
        <Image
          src={producto.imagenUrl}
          alt={producto.nombre}
          fill
          sizes="48px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/productos/${producto.id}`}
          className="line-clamp-2 text-xs font-medium text-zinc-900 hover:underline"
        >
          {producto.nombre}
        </Link>
        <p className="mt-0.5 text-xs font-semibold text-zinc-900">
          {formatearPrecio(producto.precio)}
        </p>
      </div>

      <AddToCartButton
        producto={producto}
        className="shrink-0 rounded-full bg-accent px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-hover"
      />
    </div>
  );
}
