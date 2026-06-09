import { test, expect } from "@playwright/test";
import siteConfig from "../config/sites.json";

const { baseUrl, authPage, testUser, selectors } = siteConfig;
const loginUrl = `${baseUrl}${authPage}`;

// ── Helpers ────────────────────────────────────────────────────────────────

async function fillLoginForm(page: any, email: string, password: string) {
  await page.fill(selectors.emailField, email);
  await page.fill(selectors.passwordField, password);
  await page.click(selectors.submitButton);
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe("Authentication Page", () => {

  test("login page loads with required fields", async ({ page }) => {
    await page.goto(loginUrl);
    await expect(page.locator(selectors.emailField)).toBeVisible();
    await expect(page.locator(selectors.passwordField)).toBeVisible();
    await expect(page.locator(selectors.submitButton)).toBeVisible();
  });

  test("valid credentials → redirects to dashboard", async ({ page }) => {
    await page.goto(loginUrl);
    await fillLoginForm(page, testUser.email, testUser.password);
    // After login, login form should be gone OR dashboard element appears
    await expect(page.locator(selectors.dashboardEl)).toBeVisible({ timeout: 5000 });
  });

  test("invalid credentials → shows error message", async ({ page }) => {
    await page.goto(loginUrl);
    await fillLoginForm(page, "wrong@example.com", "wrongpassword");
    await expect(page.locator(selectors.errorMessage)).toBeVisible({ timeout: 3000 });
  });

  test("empty form submission → shows validation", async ({ page }) => {
    await page.goto(loginUrl);
    await page.click(selectors.submitButton);
    // Either HTML5 validation or custom error should be visible
    const emailInvalid = await page.evaluate(
      (sel: string) => !(document.querySelector(sel) as HTMLInputElement)?.validity?.valid,
      selectors.emailField
    );
    expect(emailInvalid).toBeTruthy();
  });

});
