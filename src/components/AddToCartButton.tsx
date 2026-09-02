"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  producto: {
    id: number;
    nombre: string;
    precio: number;
    imagenUrl: string;
  };
  className?: string;
};

export default function AddToCartButton({ producto, className }: Props) {
  const { addItem } = useCart();
  const [agregado, setAgregado] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
      }
    >
      {agregado ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
