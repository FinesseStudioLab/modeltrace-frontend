/**
 * Shared site map — the single source of truth for routes, their purpose, and
 * their delivery status.
 *
 * `components/site-nav.tsx` derives the header links from it,
 * `components/expected-pages.tsx` renders the published delivery table from
 * it, and the end-to-end suites derive their coverage from it. Adding,
 * removing, or reordering a page touches this file only.
 */

export interface SiteMapEntry {
  /** Human-readable label shown in the nav bar and mobile menu. */
  label: string;
  /** Absolute path beginning with `/`. */
  href: string;
  /** One line, published in the ExpectedPages table. */
  purpose: string;
  /** Delivery status used by the ExpectedPages table. */
  status: "Scaffold" | "Planned" | "Shipped";
  /**
   * Whether the route belongs in the primary nav. Defaults to true.
   *
   * The home page is reached through the brand link, and the docs sections are
   * reached from the /docs hub and its sidebar. All of them are part of the
   * delivery contract and belong in the table, but putting them in the header
   * would push it past a dozen links. Marking them `inNav: false` keeps one
   * list behind both surfaces without conflating them.
   */
  inNav?: boolean;
}

export const siteMap: readonly SiteMapEntry[] = [
  {
    label: "Home",
    href: "/",
    purpose: "Marketing hub + site map",
    status: "Shipped",
    inNav: false,
  },
  {
    label: "Product",
    href: "/product",
    purpose: "Personas, pricing hooks, integration story",
    status: "Shipped",
  },
  {
    label: "Contracts",
    href: "/contracts",
    purpose: "Soroban modules and interaction flows",
    status: "Shipped",
  },
  {
    label: "Operators",
    href: "/operators",
    purpose: "Dashboard preview for AI gateways",
    status: "Shipped",
  },
  {
    label: "Explore",
    href: "/explore",
    purpose: "Public attestation lookup and independent verification",
    status: "Shipped",
  },
  {
    label: "Compliance",
    href: "/compliance",
    purpose: "Audit exports and policy packs",
    status: "Shipped",
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    purpose: "Milestones vs grants",
    status: "Scaffold",
  },
  {
    label: "Contributors",
    href: "/contributors",
    purpose: "Good first issues and guild roles",
    status: "Scaffold",
  },
  {
    label: "Docs",
    href: "/docs",
    purpose: "Technical reference hub",
    status: "Shipped",
  },

  // Docs reference sections. Reached from the /docs hub and its sidebar rather
  // than the header, but they are shipped routes and this table is where
  // delivery status is published.
  {
    label: "Docs — Architecture",
    href: "/docs/architecture",
    purpose: "How contracts, the API edge, and the web app divide responsibility",
    status: "Shipped",
    inNav: false,
  },
  {
    label: "Docs — Contracts",
    href: "/docs/contracts",
    purpose: "The three Soroban modules and what each one owns",
    status: "Shipped",
    inNav: false,
  },
  {
    label: "Docs — API reference",
    href: "/docs/api",
    purpose: "REST endpoints exposed by modeltrace-api",
    status: "Shipped",
    inNav: false,
  },
  {
    label: "Docs — Integration",
    href: "/docs/integration",
    purpose: "Running the web app against a local API",
    status: "Shipped",
    inNav: false,
  },
  {
    label: "Docs — Key custody",
    href: "/docs/security",
    purpose: "Why settlement is never signed server-side",
    status: "Shipped",
    inNav: false,
  },
] as const;

/** Navigation-only view (excludes the home page, which is the brand link). */
export const navLinks: readonly Pick<SiteMapEntry, "label" | "href">[] = siteMap
  .filter(({ inNav }) => inNav !== false)
  .map(({ label, href }) => ({ label, href }));

/**
 * Every route the app serves.
 *
 * The end-to-end suites assert their route lists against this, so shipping a
 * route without accessibility or navigation coverage stops being possible — a
 * new entry here turns the gap red.
 */
export const allRoutes: readonly string[] = siteMap.map(({ href }) => href);
