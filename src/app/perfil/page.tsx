import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/lib/session";

export default async function PerfilPage() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

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

      <p className="mt-6 text-sm text-zinc-500">
        El historial de pedidos estará disponible cuando se implemente el
        checkout.
      </p>
    </main>
  );
}
