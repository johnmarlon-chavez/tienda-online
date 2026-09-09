import { expect, test } from "@playwright/test";
import { correoDePrueba } from "./helpers/db";

test("registro, logout, y login vuelven a mostrar el nombre en el header", async ({ page }) => {
  const nombre = "QA Registro Login";
  const email = correoDePrueba("e2e-registro");
  const password = "password123";

  await page.goto("/registro");
  await page.locator("#nombre").fill(nombre);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await page.waitForURL("**/perfil");
  await expect(page.getByRole("banner").getByText(nombre)).toBeVisible();

  await page.getByRole("button", { name: "Salir" }).click();
  await page.waitForURL("**/login");

  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await page.waitForURL("**/perfil");
  await expect(page.getByRole("banner").getByText(nombre)).toBeVisible();
});
