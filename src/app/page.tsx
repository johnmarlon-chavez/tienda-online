import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

const IMAGEN_BANNER =
  "https://images.pexels.com/photos/5531542/pexels-photo-5531542.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600";

export default async function Home() {
  const [destacados, categoriasRaw] = await Promise.all([
    prisma.producto.findMany({
      where: { destacado: true },
      orderBy: { creadoEn: "desc" },
      // 12 es múltiplo de 2, 3 y 4: el grid cierra parejo en los tres
      // breakpoints (móvil/sm/lg) sin importar cuántos productos estén
      // marcados como destacados en la base de datos.
      take: 12,
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
      <section className="relative mb-12 overflow-hidden rounded-2xl">
        <Image
          src={IMAGEN_BANNER}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/25 via-transparent to-accent/25" />
        <div className="relative px-8 py-16 text-center text-white sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Todo lo que necesitas para tu día a día
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-zinc-200">
            Ropa, calzado, audífonos, accesorios y hogar: encuentra las
            últimas tendencias a un clic de distancia.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Link
            key={categoria}
            href={`/productos?categoria=${encodeURIComponent(categoria)}`}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-xl font-semibold">{categoria}</span>
            <span className="text-sm text-zinc-500">Ver categoría →</span>
          </Link>
        ))}
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
