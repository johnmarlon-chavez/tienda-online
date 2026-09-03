import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { obtenerUsuarioActual } from "@/lib/session";

export default async function CheckoutPage() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return <CheckoutForm />;
}
