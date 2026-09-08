# ANDES

Tienda online de ropa, calzado, audífonos, accesorios y hogar — un e-commerce de una sola marca inspirado en Falabella, construido como proyecto de portfolio full-stack con Next.js.

🔗 Demo en vivo: [próximamente]

## Features

- **Catálogo de productos** con filtro por categoría, página de detalle y productos destacados en el inicio.
- **Carrito de compras** persistente (localStorage): agregar, quitar y modificar cantidades sin perder el estado al recargar la página.
- **Autenticación propia** con sesiones en base de datos (sin librerías externas de auth): registro, login, logout y perfil con historial de pedidos.
- **Verificación de correo electrónico** al registrarse (vía Resend), con reenvío del enlace y bloqueo del checkout hasta confirmar la cuenta.
- **Checkout con validación real de stock**: el precio y la disponibilidad de cada producto se recalculan contra la base de datos al confirmar el pedido — nunca se confía en lo que llega del carrito del navegador.
- **Panel de administrador** protegido por rol: CRUD completo de productos (con categoría/subcategoría dinámicas) y listado de todos los pedidos de todos los usuarios.
- **Base de datos en la nube**: PostgreSQL serverless en Neon.
- **Imágenes reales de producto** obtenidas de la API de Pexels.

## Stack tecnológico

- **Framework:** Next.js 16 (App Router, Server Actions, Turbopack)
- **UI:** React 19 + Tailwind CSS 4
- **Base de datos:** PostgreSQL ([Neon](https://neon.tech)) + Prisma 7 (driver adapters)
- **Autenticación:** sesiones propias con cookies httpOnly (sin NextAuth ni similares)
- **Correo transaccional:** [Resend](https://resend.com)
- **Imágenes:** [Pexels API](https://www.pexels.com/api/)
- **Iconos:** lucide-react
- **Lenguaje:** TypeScript

## Cómo correrlo en local

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd tienda-online
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Y completa:

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Cadena de conexión a una base de datos PostgreSQL (por ejemplo, una gratis en [Neon](https://neon.tech)). |
| `RESEND_API_KEY` | Sí | API key de [Resend](https://resend.com), para enviar el correo de verificación al registrarse. |
| `PEXELS_API_KEY` | No | API key de [Pexels](https://www.pexels.com/api/). Solo hace falta si vas a correr `scripts/actualizar-imagenes-pexels.ts`; el seed ya incluye fotos precargadas. |
| `RESEND_FROM_EMAIL` | No | Remitente propio una vez verifiques un dominio en Resend. Por defecto usa `ANDES <onboarding@resend.dev>`. |
| `APP_URL` | No | Dominio público de la app, para que el link del correo de verificación apunte al lugar correcto en producción. Por defecto `http://localhost:3000`. |

### 3. Migrar y poblar la base de datos

```bash
npx prisma migrate dev
npx prisma db seed
```

Esto crea las tablas y siembra el catálogo con 53 productos de ejemplo, ya con fotos reales de Pexels incluidas.

### 4. Levantar el servidor

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Convertir un usuario en administrador

Todavía no hay una forma de crear un admin desde la interfaz. Después de registrarte normalmente, corre:

```bash
npx tsx scripts/hacer-admin.ts tu-correo@ejemplo.com
```

## Limitación conocida: verificación de correo

El envío de correos usa el remitente de pruebas de Resend (`onboarding@resend.dev`), ya que este proyecto no tiene un dominio propio verificado. Mientras eso sea así, **Resend solo entrega correos reales a la casilla dueña de la API key**: cualquier otra cuenta puede registrarse y usar la tienda con normalidad (login, carrito, etc.), pero no va a recibir el correo de verificación real hasta que se configure un dominio verificado en Resend.

---

Construido en fases siguiendo una especificación de MVP inicial — ver [docs/especificacion.md](docs/especificacion.md).
