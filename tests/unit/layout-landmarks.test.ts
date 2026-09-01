import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The root layout has been broken twice by merges that resolved a conflict in
 * its body by keeping both sides, leaving two <main> elements and rendering
 * {children} twice. Neither typecheck nor lint objects to that, and axe does
 * not flag it under the WCAG A/AA tags the suite runs, so it reached main
 * unnoticed. These assertions are cheap and catch it at the source.
 */
describe("root layout landmarks", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");

  it("renders exactly one <main>", () => {
    expect(layout.match(/<main[\s>]/g) ?? []).toHaveLength(1);
  });

  it("renders {children} exactly once", () => {
    expect(layout.match(/\{children\}/g) ?? []).toHaveLength(1);
  });

  it("gives the skip link a target it can actually reach", () => {
    // The anchor is inert without an element carrying that id, and the target
    // needs tabIndex to take focus rather than only scrolling into view.
    expect(layout).toContain('href="#main"');
    expect(layout).toMatch(/<main[^>]*id="main"/);
    expect(layout).toMatch(/<main[^>]*tabIndex=\{-1\}/);
  });

  it("keeps the skip link ahead of the navigation", () => {
    expect(layout.indexOf('href="#main"')).toBeLessThan(layout.indexOf("<SiteNav"));
  });
});
