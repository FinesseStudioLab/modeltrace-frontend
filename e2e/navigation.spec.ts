import { expect, test } from "@playwright/test";

/** Every route the header links to. Kept here rather than imported so that a
 *  route quietly disappearing from the nav fails a test instead of silently
 *  shrinking the suite. */
const ROUTES = [
  "/",
  "/product",
  "/contracts",
  "/operators",
  "/explore",
  "/compliance",
  "/roadmap",
  "/contributors",
  "/docs",
] as const;

/** Shipped routes reached from inside a page rather than from the header. */
const NESTED_ROUTES = [
  "/docs/architecture",
  "/docs/contracts",
  "/docs/api",
  "/docs/integration",
  "/docs/security",
] as const;

const ALL_ROUTES = [...ROUTES, ...NESTED_ROUTES] as const;

test.describe("navigation", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} renders with a heading and the site nav`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // A page that 200s but renders an error boundary still looks fine to a
      // status check, so assert on real content.
      await expect(page.getByRole("banner").or(page.locator("header.nav"))).toBeVisible();
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page).toHaveTitle(/ModelTrace/);
    });
  }

  test("the header links reach every route", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header.nav nav");

    for (const label of [
      "Product",
      "Contracts",
      "Operators",
      "Explore",
      "Compliance",
      "Roadmap",
      "Contributors",
      "Docs",
    ]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("the brand link returns to the landing page", async ({ page }) => {
    await page.goto("/docs");
    await page.locator("header.nav").getByRole("link").first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("an unknown route renders the not-found page", async ({ page }) => {
    const response = await page.goto("/no-such-route");
    expect(response?.status()).toBe(404);
  });
});

test.describe("responsive layout", () => {
  test("the page never scrolls sideways at mobile width", async ({ page }) => {
    // Horizontal overflow is the most common mobile regression and the least
    // visible one on a desktop-sized CI runner, so it is asserted directly.
    await page.setViewportSize({ width: 375, height: 812 });

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });

  test("the header navigation stays reachable at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // The header wraps rather than collapsing into a menu today. This asserts
    // the links stay reachable either way, so it keeps passing when the
    // mobile menu lands and starts failing if they become unreachable.
    const operators = page.locator("header.nav").getByRole("link", { name: "Operators" });
    await expect(operators).toBeVisible();
    await operators.click();
    await expect(page).toHaveURL(/\/operators$/);
  });
});
