"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { CATEGORIA_OTRA, SUBCATEGORIA_NINGUNA, SUBCATEGORIA_OTRA } from "./constants";

export type EstadoFormularioProducto = { error?: string };

type DatosProducto = {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  subcategoria: string | null;
  stock: number;
  imagenUrl: string;
  marca: string | null;
  destacado: boolean;
};

function leerDatosProducto(
  formData: FormData
): { datos: DatosProducto } | { error: string } {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const marca = String(formData.get("marca") ?? "").trim();
  const destacado = formData.get("destacado") === "on";

  if (!nombre || !descripcion || !imagenUrl) {
    return { error: "Completa nombre, descripción e imagen." };
  }

  const precio = Number(formData.get("precio"));
  if (!Number.isFinite(precio) || precio <= 0) {
    return { error: "El precio debe ser un número mayor a 0." };
  }

  const stock = Number(formData.get("stock"));
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "El stock debe ser un número entero mayor o igual a 0." };
  }

  const categoriaRaw = String(formData.get("categoria") ?? "");
  const categoria =
    categoriaRaw === CATEGORIA_OTRA
      ? String(formData.get("categoriaNueva") ?? "").trim()
      : categoriaRaw.trim();
  if (!categoria) {
    return { error: "Ingresa o selecciona una categoría." };
  }

  const subcategoriaRaw = String(formData.get("subcategoria") ?? "");
  let subcategoria: string | null;
  if (!subcategoriaRaw || subcategoriaRaw === SUBCATEGORIA_NINGUNA) {
    subcategoria = null;
  } else if (subcategoriaRaw === SUBCATEGORIA_OTRA) {
    const nueva = String(formData.get("subcategoriaNueva") ?? "").trim();
    if (!nueva) {
      return { error: "Ingresa el nombre de la nueva subcategoría." };
    }
    subcategoria = nueva;
  } else {
    subcategoria = subcategoriaRaw.trim();
  }

  return {
    datos: {
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      stock,
      imagenUrl,
      marca: marca || null,
      destacado,
    },
  };
}

export async function crearProducto(
  _prevState: EstadoFormularioProducto,
  formData: FormData
): Promise<EstadoFormularioProducto> {
  await requireAdmin();

  const resultado = leerDatosProducto(formData);
  if ("error" in resultado) {
    return resultado;
  }

  await prisma.producto.create({ data: resultado.datos });
  redirect("/admin/productos");
}

export async function actualizarProducto(
  id: number,
  _prevState: EstadoFormularioProducto,
  formData: FormData
): Promise<EstadoFormularioProducto> {
  await requireAdmin();

  const resultado = leerDatosProducto(formData);
  if ("error" in resultado) {
    return resultado;
  }

  await prisma.producto.update({ where: { id }, data: resultado.datos });
  redirect("/admin/productos");
}

export async function eliminarProducto(id: number): Promise<{ error?: string }> {
  await requireAdmin();

  const pedidosAsociados = await prisma.detalleOrden.count({
    where: { productoId: id },
  });
  if (pedidosAsociados > 0) {
    return {
      error:
        "No se puede eliminar: este producto ya tiene pedidos asociados. Deja el stock en 0 en vez de eliminarlo.",
    };
  }

  await prisma.producto.delete({ where: { id } });
  return {};
}
