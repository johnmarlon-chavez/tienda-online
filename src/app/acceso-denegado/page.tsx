import Link from "next/link";

export default function AccesoDenegadoPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Acceso denegado
      </h1>
      <p className="mt-2 text-zinc-500">
        No tienes permisos para ver esta página. Esta sección es solo para
        administradores.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
