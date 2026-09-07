import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-bold tracking-tight text-zinc-900">
          Panel Admin
        </h1>
        <nav className="flex gap-4 text-sm font-medium text-zinc-600">
          <Link href="/admin/productos" className="transition-colors hover:text-zinc-900">
            Productos
          </Link>
          <Link href="/admin/pedidos" className="transition-colors hover:text-zinc-900">
            Pedidos
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
