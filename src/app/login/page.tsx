"use client";

import Link from "next/link";
import { useActionState } from "react";
import { iniciarSesion, type EstadoFormulario } from "./actions";

const estadoInicial: EstadoFormulario = {};

export default function LoginPage() {
  const [estado, formAction, pending] = useActionState(
    iniciarSesion,
    estadoInicial
  );

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Iniciar sesión
      </h1>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700"
          >
            Correo electrónico
          </label>
          <input
            key={estado.email ?? ""}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={estado.email ?? ""}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
          />
        </div>

        {estado.error && (
          <p className="text-sm text-red-600">{estado.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-medium text-zinc-900 hover:underline"
        >
          Crea una
        </Link>
      </p>
    </main>
  );
}
