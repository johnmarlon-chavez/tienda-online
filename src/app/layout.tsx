import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { obtenerUsuarioActual } from "@/lib/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANDES — Ropa, calzado, audífonos, accesorios y hogar",
  description:
    "Catálogo de ropa, calzado, audífonos, accesorios y hogar. Proyecto de portfolio inspirado en Falabella.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const usuario = await obtenerUsuarioActual();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          {/* key fuerza a React a remontar el widget (reiniciando todo su
              estado interno) cada vez que cambia quién está logueado —
              login, logout, o cambio de cuenta en el mismo navegador. */}
          <ChatWidget key={usuario?.id ?? "anon"} usuarioId={usuario?.id ?? null} />
        </CartProvider>
      </body>
    </html>
  );
}
