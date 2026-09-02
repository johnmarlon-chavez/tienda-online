"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  cantidad: number;
};

type ProductoParaCarrito = {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrecio: number;
  addItem: (producto: ProductoParaCarrito, cantidad?: number) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "andes-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    // Se lee localStorage aquí (no en un initializer de useState) a propósito:
    // el servidor no tiene localStorage, así que el primer render debe ser
    // igual en servidor y cliente ([]) para no romper la hidratación. Este
    // efecto corre solo una vez, después de montar en el cliente.
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // localStorage no disponible o dato corrupto: seguimos con carrito vacío
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hidratado]);

  function addItem(producto: ProductoParaCarrito, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function incrementItem(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  }

  function decrementItem(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
          : item
      )
    );
  }

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrecio,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
