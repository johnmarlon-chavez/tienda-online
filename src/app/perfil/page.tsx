import Link from "next/link";
import { redirect } from "next/navigation";
import { formatearPrecio } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { obtenerUsuarioActual } from "@/lib/session";

const ESTILOS_ESTADO: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-purple-100 text-purple-700",
  entregado: "bg-green-100 text-green-700",
};

export default async function PerfilPage() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: usuario.id },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Mi perfil
      </h1>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xl font-semibold text-white">
          {usuario.nombre.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-lg font-semibold text-zinc-900">
            {usuario.nombre}
          </p>
          <p className="text-sm text-zinc-500">{usuario.email}</p>
        </div>
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold text-zinc-900">
        Historial de pedidos
      </h2>

      {pedidos.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Todavía no tienes pedidos.{" "}
          <Link href="/productos" className="font-medium text-zinc-900 hover:underline">
            Empieza a comprar
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <Link
                href={`/checkout/confirmacion/${pedido.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-zinc-50"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    Pedido #{pedido.id}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {pedido.creadoEn.toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    ESTILOS_ESTADO[pedido.estado] ?? "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {pedido.estado}
                </span>
                <p className="text-sm font-semibold text-zinc-900">
                  {formatearPrecio(pedido.total)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
