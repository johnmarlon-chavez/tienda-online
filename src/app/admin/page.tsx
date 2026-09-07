import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link
        href="/admin/productos"
        className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
      >
        <h2 className="text-lg font-semibold text-zinc-900">Productos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Crear, editar y eliminar productos del catálogo.
        </p>
      </Link>
      <Link
        href="/admin/pedidos"
        className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
      >
        <h2 className="text-lg font-semibold text-zinc-900">Pedidos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ver todos los pedidos realizados por los clientes.
        </p>
      </Link>
    </div>
  );
}
