import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getProducto(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return null;
  return prisma.producto.findUnique({ where: { id } });
}

export async function generateMetadata({ params }: PageProps<"/productos/[id]">) {
  const { id } = await params;
  const producto = await getProducto(id);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: `${producto.nombre} — ANDES`,
    description: producto.descripcion,
  };
}

export default async function ProductoDetallePage({
  params,
}: PageProps<"/productos/[id]">) {
  const { id } = await params;
  const producto = await getProducto(id);

  if (!producto) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-zinc-500">
        <Link href="/productos" className="hover:text-zinc-900">
          Productos
        </Link>
        <span>/</span>
        <Link
          href={`/productos?categoria=${encodeURIComponent(producto.categoria)}`}
          className="hover:text-zinc-900"
        >
          {producto.categoria}
        </Link>
        {producto.subcategoria && (
          <>
            <span>/</span>
            <span>{producto.subcategoria}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={producto.imagenUrl}
            alt={producto.nombre}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          {producto.marca && (
            <span className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              {producto.marca}
            </span>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
            {producto.nombre}
          </h1>
          <p className="mt-3 text-3xl font-semibold text-zinc-900">
            {formatearPrecio(producto.precio)}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {producto.stock > 0
              ? `${producto.stock} unidades disponibles`
              : "Sin stock disponible"}
          </p>

          <p className="mt-6 leading-relaxed text-zinc-700">
            {producto.descripcion}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-y-2 border-t border-zinc-200 pt-6 text-sm">
            <dt className="text-zinc-500">Categoría</dt>
            <dd className="text-zinc-900">{producto.categoria}</dd>
            {producto.subcategoria && (
              <>
                <dt className="text-zinc-500">Subcategoría</dt>
                <dd className="text-zinc-900">{producto.subcategoria}</dd>
              </>
            )}
            {producto.marca && (
              <>
                <dt className="text-zinc-500">Marca</dt>
                <dd className="text-zinc-900">{producto.marca}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </main>
  );
}
