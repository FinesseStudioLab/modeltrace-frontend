import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navLinks, siteMap } from "../../lib/site-map";

/**
 * Walk `app/` and return the route for every `page.tsx`.
 *
 * Route groups `(name)` and dynamic segments `[param]` are skipped: neither
 * maps to a fixed path that the delivery table can list.
 */
function routesOnDisk(dir = "app", prefix = ""): string[] {
  const found: string[] = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (entry === "page.tsx") {
      found.push(prefix === "" ? "/" : prefix);
      continue;
    }
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith("(") || entry.startsWith("[") || entry.startsWith("_")) continue;

    found.push(...routesOnDisk(full, `${prefix}/${entry}`));
  }

  return found;
}

describe("site map", () => {
  // The table on the landing page is described as the contract between product
  // and engineering, so a route shipping without an entry is the regression
  // worth catching — that is how the five /docs sections went live unlisted.
  it("lists every route that exists in app/", () => {
    const listed = new Set(siteMap.map(({ href }) => href));
    const missing = routesOnDisk().filter((route) => !listed.has(route));

    expect(missing, `these routes ship but are absent from the site map: ${missing.join(", ")}`).toEqual([]);
  });

  it("does not list a route that no longer exists", () => {
    const onDisk = new Set(routesOnDisk());
    const stale = siteMap.map(({ href }) => href).filter((href) => !onDisk.has(href));

    expect(stale, `these entries have no page.tsx: ${stale.join(", ")}`).toEqual([]);
  });

  it("keeps nested routes out of the header navigation", () => {
    // They belong in the published table, but the header is already at eight
    // links and the docs sections are reached from the /docs sidebar.
    const nested = navLinks.filter(({ href }) => href.split("/").length > 2);
    expect(nested).toEqual([]);
  });

  it("gives every entry a purpose and a known status", () => {
    for (const { href, purpose, status } of siteMap) {
      expect(purpose.trim().length, `${href} has no purpose`).toBeGreaterThan(0);
      expect(["Scaffold", "Planned", "Shipped"]).toContain(status);
    }
  });
});
