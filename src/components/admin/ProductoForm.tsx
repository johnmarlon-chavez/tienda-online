"use client";

import { useActionState, useState } from "react";
import type { Producto } from "@/generated/prisma/client";
import {
  CATEGORIA_OTRA,
  SUBCATEGORIA_NINGUNA,
  SUBCATEGORIA_OTRA,
} from "@/app/admin/productos/constants";
import type { EstadoFormularioProducto } from "@/app/admin/productos/actions";

const estadoInicial: EstadoFormularioProducto = {};

const estilosInput =
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none";
const estilosLabel = "block text-sm font-medium text-zinc-700";

export default function ProductoForm({
  producto,
  categoriasExistentes,
  action,
  textoBoton,
}: {
  producto?: Producto;
  categoriasExistentes: Record<string, string[]>;
  action: (
    state: EstadoFormularioProducto,
    formData: FormData
  ) => Promise<EstadoFormularioProducto>;
  textoBoton: string;
}) {
  const categorias = Object.keys(categoriasExistentes).sort();

  const categoriaExiste = producto ? categorias.includes(producto.categoria) : false;
  const [categoria, setCategoria] = useState(
    producto ? (categoriaExiste ? producto.categoria : CATEGORIA_OTRA) : categorias[0] ?? CATEGORIA_OTRA
  );

  const subcategoriasDisponibles =
    categoria === CATEGORIA_OTRA ? [] : categoriasExistentes[categoria] ?? [];
  const subcategoriaExiste = producto?.subcategoria
    ? subcategoriasDisponibles.includes(producto.subcategoria)
    : false;
  const [subcategoria, setSubcategoria] = useState(() => {
    if (!producto?.subcategoria) return SUBCATEGORIA_NINGUNA;
    return subcategoriaExiste ? producto.subcategoria : SUBCATEGORIA_OTRA;
  });

  const [estado, formAction, pending] = useActionState(action, estadoInicial);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <label htmlFor="nombre" className={estilosLabel}>
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          defaultValue={producto?.nombre}
          className={estilosInput}
        />
      </div>

      <div>
        <label htmlFor="descripcion" className={estilosLabel}>
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={3}
          defaultValue={producto?.descripcion}
          className={estilosInput}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className={estilosLabel}>
            Precio (S/)
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={producto?.precio}
            className={estilosInput}
          />
        </div>
        <div>
          <label htmlFor="stock" className={estilosLabel}>
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={producto?.stock}
            className={estilosInput}
          />
        </div>
      </div>

      <div>
        <label htmlFor="categoria" className={estilosLabel}>
          Categoría
        </label>
        <select
          id="categoria"
          name="categoria"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setSubcategoria(SUBCATEGORIA_NINGUNA);
          }}
          className={estilosInput}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value={CATEGORIA_OTRA}>Otra (nueva categoría)...</option>
        </select>
        {categoria === CATEGORIA_OTRA && (
          <input
            name="categoriaNueva"
            type="text"
            required
            placeholder="Nombre de la nueva categoría"
            defaultValue={!categoriaExiste ? producto?.categoria : ""}
            className={`${estilosInput} mt-2`}
          />
        )}
      </div>

      <div>
        <label htmlFor="subcategoria" className={estilosLabel}>
          Subcategoría
        </label>
        <select
          id="subcategoria"
          name="subcategoria"
          value={subcategoria}
          onChange={(e) => setSubcategoria(e.target.value)}
          className={estilosInput}
        >
          <option value={SUBCATEGORIA_NINGUNA}>Ninguna</option>
          {subcategoriasDisponibles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value={SUBCATEGORIA_OTRA}>Otra (nueva subcategoría)...</option>
        </select>
        {subcategoria === SUBCATEGORIA_OTRA && (
          <input
            name="subcategoriaNueva"
            type="text"
            required
            placeholder="Nombre de la nueva subcategoría"
            defaultValue={!subcategoriaExiste ? producto?.subcategoria ?? "" : ""}
            className={`${estilosInput} mt-2`}
          />
        )}
      </div>

      <div>
        <label htmlFor="imagenUrl" className={estilosLabel}>
          URL de imagen
        </label>
        <input
          id="imagenUrl"
          name="imagenUrl"
          type="text"
          required
          defaultValue={producto?.imagenUrl}
          placeholder="https://placehold.co/600x600.png?text=..."
          className={estilosInput}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Debe ser de un dominio permitido en next.config.ts (por ahora solo
          placehold.co).
        </p>
      </div>

      <div>
        <label htmlFor="marca" className={estilosLabel}>
          Marca (opcional)
        </label>
        <input
          id="marca"
          name="marca"
          type="text"
          defaultValue={producto?.marca ?? ""}
          className={estilosInput}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        <input
          name="destacado"
          type="checkbox"
          defaultChecked={producto?.destacado}
          className="h-4 w-4 rounded border-zinc-300"
        />
        Destacado (aparece en la página de inicio)
      </label>

      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
