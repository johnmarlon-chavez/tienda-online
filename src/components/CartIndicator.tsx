"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative flex items-center transition-colors hover:text-zinc-900"
      aria-label={`Carrito de compras, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M3 3h2l.4 2M7 13h10l3-7H5.4M7 13L5.4 5M7 13l-1.6 3.2A1 1 0 0 0 6.3 18H17" />
        <circle cx="9" cy="21" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="21" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
