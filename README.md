# Tienda Online (ANDES)

Proyecto de portfolio: tienda online de una sola marca (ropa y audífonos), inspirada en Falabella. Ver especificación completa en [docs/especificacion.md](docs/especificacion.md).

**Fase 1 (catálogo)**: página de inicio con destacados, listado con filtro por categoría y detalle de producto.

## Stack

- Next.js (App Router) + Tailwind CSS
- Prisma 7 + SQLite (`@prisma/adapter-better-sqlite3`)

## Cómo correrlo

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Notas del modelo Producto

Sigue la tabla de la especificación (nombre, descripción, precio, categoría, subcategoría, stock, imagenUrl, marca, creadoEn) y agrega `destacado: Boolean` para soportar los "productos destacados" de la página de inicio.
