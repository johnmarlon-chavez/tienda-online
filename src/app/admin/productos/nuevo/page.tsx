import ProductoForm from "@/components/admin/ProductoForm";
import { crearProducto } from "@/app/admin/productos/actions";
import { obtenerCategoriasExistentes } from "@/app/admin/productos/categorias";

export default async function NuevoProductoPage() {
  const categoriasExistentes = await obtenerCategoriasExistentes();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Nuevo producto
      </h1>
      <ProductoForm
        categoriasExistentes={categoriasExistentes}
        action={crearProducto}
        textoBoton="Crear producto"
      />
    </div>
  );
}
