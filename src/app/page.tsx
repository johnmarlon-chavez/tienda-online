import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const destacados = await prisma.producto.findMany({
    where: { destacado: true },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <section className="mb-12 rounded-2xl bg-zinc-900 px-8 py-16 text-center text-white sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ropa y audífonos para tu día a día
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-300">
          Encuentra las últimas tendencias en moda y tecnología de audio, a un
          clic de distancia.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          Ver todos los productos
        </Link>
      </section>

      <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/productos?categoria=Ropa"
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-8 transition-shadow hover:shadow-md"
        >
          <span className="text-xl font-semibold">Ropa</span>
          <span className="text-sm text-zinc-500">Ver categoría →</span>
        </Link>
        <Link
          href="/productos?categoria=Audífonos"
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-8 transition-shadow hover:shadow-md"
        >
          <span className="text-xl font-semibold">Audífonos</span>
          <span className="text-sm text-zinc-500">Ver categoría →</span>
        </Link>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Destacados</h2>
          <Link
            href="/productos"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {destacados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  );
}
