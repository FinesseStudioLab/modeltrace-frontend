import { expect, test } from "@playwright/test";

/**
 * The header has two layouts and one threshold.
 *
 * SiteNav reveals the toggle and the mobile panel at 767px. The stacked bar
 * styling has to change at the same width: when the two disagreed, widths in
 * between got the stacked column with no toggle to explain it. These assert
 * the boundary from both sides so the two cannot drift apart again.
 */
test.describe("header breakpoint", () => {
  test("stays a horizontal bar just above the mobile threshold", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto("/");

    const direction = await page
      .locator("header.nav .nav-inner")
      .evaluate((el) => getComputedStyle(el).flexDirection);
    expect(direction, "the header should not stack while the toggle is hidden").toBe("row");

    await expect(page.locator("header.nav .nav-toggle")).toBeHidden();
  });

  test("stacks and reveals the toggle below the mobile threshold", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto("/");

    const direction = await page
      .locator("header.nav .nav-inner")
      .evaluate((el) => getComputedStyle(el).flexDirection);
    expect(direction).toBe("column");

    await expect(page.locator("header.nav .nav-toggle")).toBeVisible();
  });

  test("nav links meet the 44px minimum target size once stacked", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const links = page.locator("header.nav .links a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const box = await links.nth(i).boundingBox();
      expect(box?.height ?? 0, `link ${i} is below the 44px minimum`).toBeGreaterThanOrEqual(44);
    }
  });
});
