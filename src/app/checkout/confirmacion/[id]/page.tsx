import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { obtenerUsuarioActual } from "@/lib/session";

export default async function ConfirmacionPedidoPage({
  params,
}: PageProps<"/checkout/confirmacion/[id]">) {
  const usuario = await obtenerUsuarioActual();
  if (!usuario) {
    redirect("/login");
  }

  const { id } = await params;
  const pedidoId = Number(id);
  if (!Number.isInteger(pedidoId)) {
    notFound();
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: { items: { include: { producto: true } } },
  });

  if (!pedido || pedido.usuarioId !== usuario.id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-2 text-zinc-500">Número de orden: #{pedido.id}</p>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
        <ul className="flex flex-col divide-y divide-zinc-200">
          {pedido.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-zinc-700">
                {item.producto.nombre} × {item.cantidad}
              </span>
              <span className="font-medium text-zinc-900">
                {formatearPrecio(item.precioUnitario * item.cantidad)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-base font-semibold text-zinc-900">Total</span>
          <span className="text-xl font-bold text-zinc-900">
            {formatearPrecio(pedido.total)}
          </span>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Envío a: {pedido.direccionEnvio}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/productos"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-900"
        >
          Seguir comprando
        </Link>
        <Link
          href="/perfil"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Ver mis pedidos
        </Link>
      </div>
    </main>
  );
}
