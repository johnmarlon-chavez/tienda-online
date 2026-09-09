import { expect, test } from "@playwright/test";
import { correoDePrueba, crearCookieDeSesion, crearUsuarioVerificado } from "./helpers/db";

test("flujo de compra completo: catálogo -> carrito -> checkout -> confirmación", async ({
  page,
  context,
  baseURL,
}) => {
  // El checkout está bloqueado para correos sin verificar (Fase 6), y no
  // podemos depender de recibir un correo real de Resend en un test. Se crea
  // el usuario ya verificado directo en la base y se inyecta su sesión como
  // cookie — el login/registro por UI ya lo cubre otro test.
  const usuario = await crearUsuarioVerificado({
    nombre: "QA Compra",
    email: correoDePrueba("e2e-compra"),
    password: "password123",
  });
  const cookie = await crearCookieDeSesion(usuario.id, baseURL!);
  await context.addCookies([cookie]);

  await page.goto("/productos");
  await expect(page.getByRole("heading", { name: "Productos" })).toBeVisible();

  const primeraTarjeta = page.locator("a[href^='/productos/']").first();
  const nombreProducto = (await primeraTarjeta.locator("h3").innerText()).trim();

  await page.getByRole("button", { name: "Agregar al carrito" }).first().click();
  await expect(page.getByRole("button", { name: "Agregado ✓" }).first()).toBeVisible();

  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

  await page.locator("#direccion").fill("Av. Siempre Viva 123");
  await page.locator("#distrito").fill("Miraflores");
  await page.locator("#telefono").fill("999888777");
  await page.getByRole("button", { name: "Confirmar pedido" }).click();

  await page.waitForURL(/\/checkout\/confirmacion\/\d+/);
  await expect(page.getByRole("heading", { name: "¡Pedido confirmado!" })).toBeVisible();
  await expect(page.getByText(/Número de orden: #\d+/)).toBeVisible();
  await expect(page.getByText(nombreProducto)).toBeVisible();
});
