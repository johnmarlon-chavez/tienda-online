import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function VerificarEmailPage({
  searchParams,
}: PageProps<"/verificar-email">) {
  const { token: tokenParam } = await searchParams;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  let titulo: string;
  let mensaje: string;
  let exito = false;

  if (!token) {
    titulo = "Enlace inválido";
    mensaje = "Falta el token de verificación en el enlace.";
  } else {
    const registro = await prisma.tokenVerificacion.findUnique({ where: { token } });

    if (!registro) {
      titulo = "Enlace inválido";
      mensaje = "Este enlace de verificación no existe o ya fue usado.";
    } else if (registro.expiraEn < new Date()) {
      titulo = "Enlace vencido";
      mensaje =
        "Este enlace de verificación ya venció. Inicia sesión y solicita uno nuevo desde tu perfil.";
      await prisma.tokenVerificacion.delete({ where: { token } }).catch(() => {});
    } else {
      await prisma.$transaction([
        prisma.usuario.update({
          where: { id: registro.usuarioId },
          data: { emailVerificado: true },
        }),
        prisma.tokenVerificacion.deleteMany({ where: { usuarioId: registro.usuarioId } }),
      ]);
      titulo = "¡Correo verificado!";
      mensaje = "Tu correo fue confirmado correctamente. Ya puedes completar compras.";
      exito = true;
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center sm:px-6">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
          exito ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {exito ? "✓" : "✕"}
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{titulo}</h1>
      <p className="text-zinc-500">{mensaje}</p>
      <Link
        href={exito ? "/perfil" : "/login"}
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        {exito ? "Ir a mi perfil" : "Iniciar sesión"}
      </Link>
    </main>
  );
}
