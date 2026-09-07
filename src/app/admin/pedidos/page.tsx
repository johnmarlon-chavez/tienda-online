import Link from "next/link";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const ESTILOS_ESTADO: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregado: "bg-green-100 text-green-700",
};

export default async function AdminPedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    include: { usuario: true },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Pedidos
      </h1>

      {pedidos.length === 0 ? (
        <p className="text-sm text-zinc-500">Todavía no hay pedidos.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/checkout/confirmacion/${pedido.id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      #{pedido.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{pedido.usuario.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        ESTILOS_ESTADO[pedido.estado] ?? "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    {formatearPrecio(pedido.total)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {pedido.creadoEn.toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
