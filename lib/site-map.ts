export const publicRoutes = [
  {
    path: "/",
    purpose: "Marketing hub + site map",
    status: "Scaffold",
    description:
      "Learn how ModelTrace turns AI usage into attested facts on-chain for procurement, finance, and audit teams.",
  },
  {
    path: "/product",
    purpose: "Personas, pricing hooks, integration story",
    status: "Planned",
    description: "Verifiable usage, dispute-free settlement, and immutable audit trails.",
  },
  {
    path: "/contracts",
    purpose: "Soroban modules and interaction flows",
    status: "Planned",
    description: "Explore ModelTrace Soroban modules and interaction flows.",
  },
  {
    path: "/operators",
    purpose: "Dashboard preview for AI gateways",
    status: "Planned",
    description: "Operator dashboard — live testnet data and quota headroom.",
  },
  {
    path: "/compliance",
    purpose: "Audit exports and policy packs",
    status: "Planned",
    description: "Verifiable lineage, GDPR-compliant data residency, and deterministic evidence.",
  },
  {
    path: "/roadmap",
    purpose: "Milestones vs grants",
    status: "Scaffold",
    description: "Track ModelTrace milestones, protocol releases, and grant checkpoints.",
  },
  {
    path: "/contributors",
    purpose: "Good first issues and guild roles",
    status: "Planned",
    description: "Find ModelTrace good first issues and contributor guild roles.",
  },
  {
    path: "/docs",
    purpose: "Technical reference hub",
    status: "Scaffold",
    description: "Read ModelTrace technical specifications, governance, and integration guides.",
  },
] as const;

export type PublicPath = (typeof publicRoutes)[number]["path"];

export function getRouteDescription(path: PublicPath): string {
  const route = publicRoutes.find((candidate) => candidate.path === path);

  if (!route) {
    throw new Error(`Unknown public route: ${path}`);
  }

  return route.description;
}
