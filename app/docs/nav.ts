/**
 * The docs section registry.
 *
 * Single source for the sidebar, the hub page cards, and each page's "next"
 * link, so a new section cannot appear in one place and be missing from
 * another. Order here is reading order.
 */
export type DocsSection = {
  href: string;
  title: string;
  /** One line, shown on the hub cards and as the page lead. */
  summary: string;
  /**
   * Whether the subject matter is implemented today or still specified-only.
   * Surfaced to the reader rather than hidden — the same delivery honesty the
   * site map on `/` applies to routes.
   */
  status: "Implemented" | "Specified";
};

export const docsSections: DocsSection[] = [
  {
    href: "/docs/architecture",
    title: "Architecture",
    summary:
      "How the contracts, the API edge, and this web app divide responsibility.",
    status: "Implemented",
  },
  {
    href: "/docs/contracts",
    title: "Contracts",
    summary:
      "The three Soroban modules — audit-registry, usage-meter, payment-router — and what each owns.",
    status: "Specified",
  },
  {
    href: "/docs/api",
    title: "API reference",
    summary:
      "REST endpoints exposed by modeltrace-api, with request and response shapes.",
    status: "Implemented",
  },
  {
    href: "/docs/integration",
    title: "Integration guide",
    summary:
      "Running the web app against a local API, and the environment variables involved.",
    status: "Implemented",
  },
  {
    href: "/docs/security",
    title: "Key custody",
    summary:
      "Why settlement is never signed server-side, and what the signing provider modes mean.",
    status: "Implemented",
  },
];

export function sectionFor(href: string): DocsSection | undefined {
  return docsSections.find((section) => section.href === href);
}

/** The section after `href` in reading order, for sequential navigation. */
export function nextSection(href: string): DocsSection | undefined {
  const index = docsSections.findIndex((section) => section.href === href);
  return index === -1 ? undefined : docsSections[index + 1];
}
