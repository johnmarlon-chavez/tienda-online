import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const img = (texto: string) =>
  `https://placehold.co/600x600.png?text=${encodeURIComponent(texto)}`;

const productos = [
  // Ropa - Hombre
  {
    nombre: "Polo básico algodón",
    descripcion: "Polo de algodón 100% pima, corte regular, ideal para el día a día.",
    precio: 39.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 40,
    imagenUrl: img("Polo Basico Hombre"),
    marca: "Urbano",
    destacado: true,
  },
  {
    nombre: "Camisa a cuadros manga larga",
    descripcion: "Camisa de franela a cuadros, manga larga, perfecta para climas fríos.",
    precio: 69.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 25,
    imagenUrl: img("Camisa a Cuadros"),
    marca: "Northline",
  },
  {
    nombre: "Pantalón jean slim fit",
    descripcion: "Jean de corte slim fit, denim elástico para mayor comodidad.",
    precio: 99.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 30,
    imagenUrl: img("Jean Slim Hombre"),
    marca: "Levi's",
    destacado: true,
  },
  {
    nombre: "Casaca cortavientos",
    descripcion: "Casaca impermeable y liviana, ideal para actividades al aire libre.",
    precio: 129.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 18,
    imagenUrl: img("Casaca Cortavientos"),
    marca: "Northline",
  },
  {
    nombre: "Short deportivo hombre",
    descripcion: "Short de secado rápido con bolsillos laterales, ideal para entrenar.",
    precio: 44.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 35,
    imagenUrl: img("Short Deportivo"),
    marca: "Nike",
  },
  {
    nombre: "Sweater cuello redondo",
    descripcion: "Sweater de algodón con cuello redondo, disponible en varios colores.",
    precio: 79.9,
    categoria: "Ropa",
    subcategoria: "Hombre",
    stock: 22,
    imagenUrl: img("Sweater Hombre"),
    marca: "Urbano",
  },

  // Ropa - Mujer
  {
    nombre: "Blusa manga larga",
    descripcion: "Blusa de vestir manga larga, tela suave y fresca.",
    precio: 59.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 28,
    imagenUrl: img("Blusa Mujer"),
    marca: "Zara",
    destacado: true,
  },
  {
    nombre: "Vestido casual verano",
    descripcion: "Vestido ligero de tirantes, estampado floral, ideal para el verano.",
    precio: 89.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 20,
    imagenUrl: img("Vestido Casual"),
    marca: "Zara",
    destacado: true,
  },
  {
    nombre: "Jean tiro alto",
    descripcion: "Jean de tiro alto, corte skinny, con elastano para mayor comodidad.",
    precio: 109.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 26,
    imagenUrl: img("Jean Tiro Alto"),
    marca: "Levi's",
  },
  {
    nombre: "Chompa oversize",
    descripcion: "Chompa de punto oversize, tejido grueso, muy abrigadora.",
    precio: 94.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 15,
    imagenUrl: img("Chompa Oversize"),
    marca: "H&M",
  },
  {
    nombre: "Leggings deportivo mujer",
    descripcion: "Leggings de compresión, tela transpirable, cintura alta.",
    precio: 54.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 32,
    imagenUrl: img("Leggings Deportivo"),
    marca: "Adidas",
  },
  {
    nombre: "Chaqueta denim mujer",
    descripcion: "Chaqueta de jean clásica, corte entallado.",
    precio: 119.9,
    categoria: "Ropa",
    subcategoria: "Mujer",
    stock: 17,
    imagenUrl: img("Chaqueta Denim"),
    marca: "H&M",
  },

  // Ropa - Niños
  {
    nombre: "Polo estampado niño",
    descripcion: "Polo de algodón con estampado divertido, tallas 4 a 12 años.",
    precio: 29.9,
    categoria: "Ropa",
    subcategoria: "Niños",
    stock: 40,
    imagenUrl: img("Polo Nino"),
    marca: "Urbano Kids",
  },
  {
    nombre: "Conjunto deportivo niña",
    descripcion: "Conjunto de buzo y polo deportivo para niña, tallas 4 a 12 años.",
    precio: 69.9,
    categoria: "Ropa",
    subcategoria: "Niños",
    stock: 24,
    imagenUrl: img("Conjunto Nina"),
    marca: "Adidas Kids",
  },
  {
    nombre: "Casaca impermeable niños",
    descripcion: "Casaca liviana e impermeable, ideal para días de lluvia.",
    precio: 74.9,
    categoria: "Ropa",
    subcategoria: "Niños",
    stock: 16,
    imagenUrl: img("Casaca Nino"),
    marca: "Northline Kids",
  },

  // Audífonos
  {
    nombre: "Audífonos inalámbricos Bluetooth",
    descripcion: "Audífonos TWS con estuche de carga, hasta 24 horas de batería total.",
    precio: 149.9,
    categoria: "Audífonos",
    subcategoria: "Inalámbricos",
    stock: 45,
    imagenUrl: img("Audifonos Bluetooth"),
    marca: "JBL",
    destacado: true,
  },
  {
    nombre: "Audífonos in-ear con cable",
    descripcion: "Audífonos con cable y micrófono integrado, conector 3.5mm.",
    precio: 39.9,
    categoria: "Audífonos",
    subcategoria: "Con cable",
    stock: 60,
    imagenUrl: img("Audifonos In Ear"),
    marca: "Sony",
  },
  {
    nombre: "Audífonos gamer con micrófono",
    descripcion: "Audífonos over-ear con micrófono abatible y sonido envolvente 7.1.",
    precio: 179.9,
    categoria: "Audífonos",
    subcategoria: "Gamer",
    stock: 20,
    imagenUrl: img("Audifonos Gamer"),
    marca: "HyperX",
    destacado: true,
  },
  {
    nombre: "Audífonos deportivos resistentes al agua",
    descripcion: "Audífonos inalámbricos con certificación IPX7, ideales para entrenar.",
    precio: 129.9,
    categoria: "Audífonos",
    subcategoria: "Deportivos",
    stock: 30,
    imagenUrl: img("Audifonos Deportivos"),
    marca: "JBL",
  },
  {
    nombre: "Audífonos over-ear cancelación de ruido",
    descripcion: "Audífonos con cancelación activa de ruido y hasta 30 horas de batería.",
    precio: 399.9,
    categoria: "Audífonos",
    subcategoria: "Inalámbricos",
    stock: 12,
    imagenUrl: img("Audifonos Cancelacion Ruido"),
    marca: "Sony",
    destacado: true,
  },
  {
    nombre: "Audífonos TWS mini",
    descripcion: "Audífonos inalámbricos ultra compactos con estuche de carga rápida.",
    precio: 89.9,
    categoria: "Audífonos",
    subcategoria: "Inalámbricos",
    stock: 38,
    imagenUrl: img("Audifonos TWS Mini"),
    marca: "Xiaomi",
  },
  {
    nombre: "Audífonos para correr con gancho",
    descripcion: "Audífonos deportivos con gancho para la oreja, ajuste seguro.",
    precio: 69.9,
    categoria: "Audífonos",
    subcategoria: "Deportivos",
    stock: 27,
    imagenUrl: img("Audifonos Correr"),
    marca: "Xiaomi",
  },
  {
    nombre: "Diadema Bluetooth plegable",
    descripcion: "Diadema inalámbrica plegable, cómoda para uso prolongado.",
    precio: 109.9,
    categoria: "Audífonos",
    subcategoria: "Inalámbricos",
    stock: 19,
    imagenUrl: img("Diadema Bluetooth"),
    marca: "JBL",
  },
];

async function main() {
  console.log(`Sembrando ${productos.length} productos...`);
  await prisma.producto.deleteMany();
  await prisma.producto.createMany({ data: productos });
  console.log("Listo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
