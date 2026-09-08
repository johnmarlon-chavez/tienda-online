import { Mountain } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-zinc-900">
          <Mountain className="h-5 w-5 text-accent" aria-hidden="true" />
          ANDES
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/" className="transition-colors hover:text-zinc-900">
            Inicio
          </Link>
          <Link href="/productos" className="transition-colors hover:text-zinc-900">
            Productos
          </Link>
        </nav>

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} ANDES. Proyecto de portfolio.
        </p>
      </div>
    </footer>
  );
}
