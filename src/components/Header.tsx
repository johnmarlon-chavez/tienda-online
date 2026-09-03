import Link from "next/link";
import CartIndicator from "@/components/CartIndicator";
import { cerrarSesion, obtenerUsuarioActual } from "@/lib/session";

export default async function Header() {
  const usuario = await obtenerUsuarioActual();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          ANDES
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/" className="transition-colors hover:text-zinc-900">
            Inicio
          </Link>
          <Link href="/productos" className="transition-colors hover:text-zinc-900">
            Productos
          </Link>
          <CartIndicator />

          {usuario ? (
            <div className="flex items-center gap-4">
              <Link
                href="/perfil"
                className="flex items-center gap-2 transition-colors hover:text-zinc-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{usuario.nombre}</span>
              </Link>
              <form action={cerrarSesion}>
                <button
                  type="submit"
                  className="transition-colors hover:text-zinc-900"
                >
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="transition-colors hover:text-zinc-900">
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-white transition-colors hover:bg-zinc-700"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
