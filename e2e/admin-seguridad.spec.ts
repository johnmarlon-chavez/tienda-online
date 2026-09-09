import { expect, test } from "@playwright/test";

test("sin sesión iniciada, /admin/productos redirige a /login", async ({ page }) => {
  await page.goto("/admin/productos");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible();
});
