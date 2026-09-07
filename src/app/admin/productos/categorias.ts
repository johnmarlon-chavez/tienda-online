import { prisma } from "@/lib/prisma";

// Categoría -> lista de subcategorías ya usadas por algún producto.
// Alimenta los <select> dependientes del formulario de producto.
export async function obtenerCategoriasExistentes(): Promise<
  Record<string, string[]>
> {
  const filas = await prisma.producto.findMany({
    select: { categoria: true, subcategoria: true },
    distinct: ["categoria", "subcategoria"],
    orderBy: [{ categoria: "asc" }, { subcategoria: "asc" }],
  });

  const mapa: Record<string, string[]> = {};
  for (const fila of filas) {
    if (!mapa[fila.categoria]) {
      mapa[fila.categoria] = [];
    }
    if (fila.subcategoria) {
      mapa[fila.categoria].push(fila.subcategoria);
    }
  }
  return mapa;
}
