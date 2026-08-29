import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Every route axe runs against.
 *
 * Listed explicitly rather than derived, so a route dropping out of coverage
 * is a visible diff rather than a silently shorter run.
 */
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
  "/docs/architecture",
  "/docs/contracts",
  "/docs/api",
  "/docs/integration",
  "/docs/security",
] as const;

/**
 * Automated accessibility assertions.
 *
 * This is the highest-value part of the suite: it turns accessibility from
 * something that is true on the day of an audit into something that stays
 * true, because a regression fails the pull request that introduced it.
 *
 * axe catches roughly a third of real issues — it cannot judge whether alt
 * text is meaningful or whether a flow makes sense with a keyboard. It is a
 * floor, not a substitute for the periodic manual pass.
 */
test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} has no detectable WCAG A/AA violations`, async ({ page }) => {
      await page.goto(route);

      // Metadata resolves slightly after load, and axe reads document.title at
      // analyze time. Without this the document-title rule reports a spurious
      // violation under parallel load — settle the document first so a failure
      // here means a real one.
      await expect(page).toHaveTitle(/ModelTrace/);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Name the rules and the elements in the failure, so a red CI run is
      // actionable without reopening the report artifact.
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s): ${v.nodes[0]?.target.join(" ")}`,
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test("landing page is navigable by keyboard alone", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? { tag: el.tagName, visible: !!(el as HTMLElement).offsetParent } : null;
    });

    // A focus trap or a hidden first stop is a keyboard dead end on arrival.
    expect(focused).not.toBeNull();
    expect(focused?.tag).toBe("A");
    expect(focused?.visible).toBe(true);
  });

  // One test per route rather than one loop over all of them. As a single
  // test the navigations ran serially and the whole set had to finish inside
  // one 30s timeout, which stopped fitting once the docs routes brought the
  // count to fourteen. Split, each case is fast, parallelisable, and names the
  // offending route in the report by itself.
  for (const route of ROUTES) {
    test(`${route} has a heading as its entry point`, async ({ page }) => {
      await page.goto(route);
      const headings = await page.locator("h1, h2").first().textContent();
      expect(headings?.trim().length, `${route} has no leading heading`).toBeGreaterThan(0);
    });
  }

});
