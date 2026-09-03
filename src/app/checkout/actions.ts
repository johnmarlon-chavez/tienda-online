"use server";

import { prisma } from "@/lib/prisma";
import { obtenerUsuarioActual } from "@/lib/session";

type ItemEntrada = { id: number; cantidad: number };
type DatosCheckout = { direccion: string; items: ItemEntrada[] };
type ResultadoCheckout = { error?: string; pedidoId?: number };

export async function crearPedido(
  datos: DatosCheckout
): Promise<ResultadoCheckout> {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) {
    return { error: "Debes iniciar sesión para completar la compra." };
  }

  const direccion = datos.direccion.trim();
  if (!direccion) {
    return { error: "Ingresa una dirección de envío." };
  }

  const items = datos.items.filter((item) => item.cantidad > 0);
  if (items.length === 0) {
    return { error: "Tu carrito está vacío." };
  }

  try {
    const pedido = await prisma.$transaction(async (tx) => {
      let total = 0;
      const detalles: {
        productoId: number;
        cantidad: number;
        precioUnitario: number;
      }[] = [];

      // Se recalcula todo contra la base de datos: nunca se confía en el
      // precio ni el stock que venga del carrito del navegador.
      for (const item of items) {
        const producto = await tx.producto.findUnique({
          where: { id: item.id },
        });
        if (!producto) {
          throw new Error("Uno de los productos del carrito ya no está disponible.");
        }
        if (producto.stock < item.cantidad) {
          throw new Error(
            `Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}).`
          );
        }

        total += producto.precio * item.cantidad;
        detalles.push({
          productoId: producto.id,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
        });

        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: { decrement: item.cantidad } },
        });
      }

      return tx.pedido.create({
        data: {
          usuarioId: usuario.id,
          direccionEnvio: direccion,
          total,
          estado: "confirmado",
          items: { create: detalles },
        },
      });
    });

    return { pedidoId: pedido.id };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "No se pudo procesar el pedido.",
    };
  }
}
