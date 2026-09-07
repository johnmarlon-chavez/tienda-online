import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import ReenviarVerificacionBoton from "@/components/ReenviarVerificacionBoton";
import { obtenerUsuarioActual } from "@/lib/session";

export default async function CheckoutPage() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  if (!usuario.emailVerificado) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Verifica tu correo
        </h1>
        <p className="text-zinc-500">
          Antes de completar una compra necesitas confirmar tu correo
          electrónico. Revisa tu bandeja de entrada o solicita un nuevo
          enlace.
        </p>
        <ReenviarVerificacionBoton />
        <Link href="/carrito" className="text-sm font-medium text-zinc-900 hover:underline">
          Volver al carrito
        </Link>
      </main>
    );
  }

  return <CheckoutForm />;
}
