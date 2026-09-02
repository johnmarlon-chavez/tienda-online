import Link from "next/link";

export default function Header() {
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
        </nav>
      </div>
    </header>
  );
}
