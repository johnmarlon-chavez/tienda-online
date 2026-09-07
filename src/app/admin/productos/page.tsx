import Link from "next/link";
import EliminarProductoBoton from "@/components/admin/EliminarProductoBoton";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminProductosPage() {
  const productos = await prisma.producto.findMany({
    orderBy: { creadoEn: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-sm text-zinc-500">Todavía no hay productos.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Destacado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {producto.nombre}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {producto.categoria}
                    {producto.subcategoria && (
                      <span className="text-zinc-400"> / {producto.subcategoria}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {formatearPrecio(producto.precio)}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{producto.stock}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {producto.destacado ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/productos/${producto.id}/editar`}
                        className="text-sm font-medium text-zinc-900 hover:underline"
                      >
                        Editar
                      </Link>
                      <EliminarProductoBoton id={producto.id} nombre={producto.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
