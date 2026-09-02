import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function ProductosPage({
  searchParams,
}: PageProps<"/productos">) {
  const { categoria } = await searchParams;
  const categoriaSeleccionada = Array.isArray(categoria)
    ? categoria[0]
    : categoria;

  const [productos, categoriasRaw] = await Promise.all([
    prisma.producto.findMany({
      where: categoriaSeleccionada ? { categoria: categoriaSeleccionada } : undefined,
      orderBy: { nombre: "asc" },
    }),
    prisma.producto.findMany({
      distinct: ["categoria"],
      select: { categoria: true },
      orderBy: { categoria: "asc" },
    }),
  ]);

  const categorias = categoriasRaw.map((c) => c.categoria);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Productos</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/productos"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !categoriaSeleccionada
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
          }`}
        >
          Todos
        </Link>
        {categorias.map((c) => (
          <Link
            key={c}
            href={`/productos?categoria=${encodeURIComponent(c)}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categoriaSeleccionada === c
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {productos.length === 0 ? (
        <p className="text-zinc-500">
          No se encontraron productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}
