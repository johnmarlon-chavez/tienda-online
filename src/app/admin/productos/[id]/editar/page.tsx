import { notFound } from "next/navigation";
import ProductoForm from "@/components/admin/ProductoForm";
import { actualizarProducto } from "@/app/admin/productos/actions";
import { obtenerCategoriasExistentes } from "@/app/admin/productos/categorias";
import { prisma } from "@/lib/prisma";

export default async function EditarProductoPage({
  params,
}: PageProps<"/admin/productos/[id]/editar">) {
  const { id } = await params;
  const productoId = Number(id);
  if (!Number.isInteger(productoId)) {
    notFound();
  }

  const producto = await prisma.producto.findUnique({ where: { id: productoId } });
  if (!producto) {
    notFound();
  }

  const categoriasExistentes = await obtenerCategoriasExistentes();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Editar producto
      </h1>
      <ProductoForm
        producto={producto}
        categoriasExistentes={categoriasExistentes}
        action={actualizarProducto.bind(null, producto.id)}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
