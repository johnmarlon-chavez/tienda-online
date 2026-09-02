Especificación inicial — Tienda Online (tipo Falabella)

Documento para entregar a Claude Code como punto de partida del proyecto. Enfoque: MVP de una sola tienda (no marketplace multi-vendedor), portfolio personal.

1. Objetivo del proyecto

Crear una tienda online de comercio electrónico que venda ropa y accesorios (audífonos, etc.), inspirada en el modelo de Falabella pero simplificada a una sola tienda (un solo vendedor, no marketplace).

2. Stack tecnológico
Frontend: Next.js (React) + Tailwind CSS
Backend: API routes de Next.js (o Node.js/Express si se prefiere separar más adelante)
Base de datos: PostgreSQL + Prisma ORM (alternativa más simple para empezar: SQLite)
Autenticación: NextAuth.js (o similar)
Hosting sugerido: Vercel
Control de versiones: Git + GitHub (repo público o privado normal)
3. Alcance del MVP (fases)
Fase 1 — Catálogo (sin lógica de compra)
Página de inicio con productos destacados
Página de listado de productos por categoría
Página de detalle de producto
Buscador simple por nombre
Fase 2 — Carrito de compras
Agregar/quitar productos del carrito
Modificar cantidades
Ver resumen y total
Fase 3 — Autenticación
Registro de usuario
Login / logout
Perfil básico del usuario (nombre, email, historial de pedidos)
Fase 4 — Checkout
Formulario de dirección de envío
Resumen de compra
Confirmación de pedido (sin pasarela de pago real al inicio — se puede simular)
Fase 5 — Panel de administrador (básico)
Login de admin separado (o rol de usuario)
CRUD de productos (crear, editar, eliminar, ver stock)
Ver lista de pedidos realizados
4. Modelo de datos (entidades principales)
Producto
Campo	Tipo	Notas
id	UUID / autoincrement	
nombre	string	
descripcion	text	
precio	decimal	
categoria	string / relación	Ej: "Ropa", "Audífonos", "Accesorios"
subcategoria	string (opcional)	Ej: "Ropa > Hombre > Polos"
stock	int	
imagen_url	string	Al inicio pueden ser URLs de placeholder
marca	string (opcional)	
creado_en	datetime	
Usuario
Campo	Tipo	Notas
id	UUID	
nombre	string	
email	string (único)	
password_hash	string	
rol	enum	"cliente" / "admin"
creado_en	datetime	
Pedido (Orden)
Campo	Tipo	Notas
id	UUID	
usuario_id	FK a Usuario	
estado	enum	"pendiente", "confirmado", "enviado", "entregado"
total	decimal	
direccion_envio	string	
creado_en	datetime	
DetalleOrden (items de un pedido)
Campo	Tipo	Notas
id	UUID	
orden_id	FK a Pedido	
producto_id	FK a Producto	
cantidad	int	
precio_unitario	decimal	Precio al momento de la compra
5. Páginas necesarias (rutas del frontend)
/ — Inicio (productos destacados, banners de categorías)
/productos — Listado con filtros (categoría, precio, marca)
/productos/[id] — Detalle de producto
/carrito — Carrito de compras
/checkout — Formulario de compra
/login — Iniciar sesión
/registro — Crear cuenta
/perfil — Datos del usuario + historial de pedidos
/admin — Panel de administración (protegido por rol)
/admin/productos — CRUD de productos
6. Datos de prueba (seed)

Para poblar la tienda al inicio, generar entre 20 y 30 productos de ejemplo repartidos en categorías como:

Ropa (hombre, mujer, niños)
Audífonos / Electrónica de audio
Accesorios (mochilas, relojes, lentes)

Usar imágenes de placeholder (ej. https://placehold.co/ o similar) y precios en soles (S/).

7. Cómo trabajar con Claude Code (recomendación de flujo)
Iniciar el proyecto: npx create-next-app@latest con Tailwind incluido.
Pedir la Fase 1 completa (catálogo) antes de pasar a la Fase 2. No pedir todo el proyecto de una sola vez.
Después de cada fase, probar manualmente en el navegador (npm run dev) antes de continuar.
Hacer commit en Git después de cada fase funcional, con mensajes descriptivos (ej. feat: catálogo de productos con filtro por categoría).
Pedirle a Claude Code explicaciones breves de las partes clave del código generado, para poder entender y explicar el proyecto después.
8. Ideas para diferenciarlo (opcional, fases posteriores)
Modo oscuro
Wishlist / favoritos
Reseñas y calificaciones de productos
Cupones de descuento
Integración con pasarela de pago real en modo sandbox (Stripe / Mercado Pago)