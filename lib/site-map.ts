/**
 * Shared site map — the single source of truth for primary navigation routes.
 *
 * `app/layout.tsx`, `components/site-nav.tsx`, and
 * `components/expected-pages.tsx` all reference this list so that adding,
 * removing, or reordering a page only touches one file.
 */

export interface SiteMapEntry {
  /** Human-readable label shown in the nav bar and mobile menu. */
  label: string;
  /** Absolute path beginning with `/`. */
  href: string;
  /** Delivery status used by the ExpectedPages table. */
  status: "Scaffold" | "Planned" | "Shipped";
}

export const siteMap: readonly SiteMapEntry[] = [
  { label: "Product", href: "/product", status: "Planned" },
  { label: "Contracts", href: "/contracts", status: "Planned" },
  { label: "Operators", href: "/operators", status: "Scaffold" },
  { label: "Explore", href: "/explore", status: "Shipped" },
  { label: "Compliance", href: "/compliance", status: "Planned" },
  { label: "Roadmap", href: "/roadmap", status: "Shipped" },
  { label: "Contributors", href: "/contributors", status: "Planned" },
  { label: "Docs", href: "/docs", status: "Planned" },
] as const;

/** Navigation-only view (excludes the home page, which is the brand link). */
export const navLinks: readonly Pick<SiteMapEntry, "label" | "href">[] =
  siteMap.map(({ label, href }) => ({ label, href }));
