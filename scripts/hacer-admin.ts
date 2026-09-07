// Uso: npx tsx scripts/hacer-admin.ts correo@ejemplo.com
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Uso: npx tsx scripts/hacer-admin.ts correo@ejemplo.com");
    process.exitCode = 1;
    return;
  }

  const usuario = await prisma.usuario.update({
    where: { email },
    data: { rol: "admin" },
  });

  console.log(`Listo: ${usuario.email} ahora tiene rol "admin".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
