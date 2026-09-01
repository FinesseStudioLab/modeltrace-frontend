/**
 * Which deployment this build is, and what it is allowed to talk to.
 *
 * Previews are built from unreviewed branches, so they must never be pointed
 * at production services and must never be indexed. Rather than trusting the
 * workflow to set every variable correctly, the rules are enforced here and
 * the build fails loudly if a preview is configured to reach production.
 */

export type DeployEnv = "production" | "preview" | "development";

type Env = Record<string, string | undefined>;

/** Hosts a preview is never allowed to point at. */
const PRODUCTION_HOSTS = ["mainnet", "horizon.stellar.org", "api.modeltrace"];

export function resolveDeployEnv(env: Env = process.env): DeployEnv {
  const explicit = env.NEXT_PUBLIC_DEPLOY_ENV?.trim().toLowerCase();
  if (explicit === "production" || explicit === "preview" || explicit === "development") {
    return explicit;
  }

  // Vercel sets this for every deployment; fall back to it so a preview is
  // still recognised as one if the explicit variable is forgotten.
  const vercel = env.NEXT_PUBLIC_VERCEL_ENV?.trim().toLowerCase();
  if (vercel === "production" || vercel === "preview") return vercel;

  return env.NODE_ENV === "production" ? "production" : "development";
}

export function isPreview(env: Env = process.env): boolean {
  return resolveDeployEnv(env) === "preview";
}

/** The network label the UI shows. Previews are pinned to testnet. */
export function resolveNetwork(env: Env = process.env): string {
  if (isPreview(env)) return "testnet";
  return env.NEXT_PUBLIC_STELLAR_NETWORK?.trim() || "testnet";
}

/**
 * Throws when a preview is configured to reach production.
 *
 * Called at module load from the root layout, so a misconfigured preview fails
 * the build rather than deploying something that quietly writes to mainnet.
 */
export function assertPreviewTargetsAreSafe(env: Env = process.env): void {
  if (!isPreview(env)) return;

  const network = env.NEXT_PUBLIC_STELLAR_NETWORK?.trim().toLowerCase();
  if (network && network !== "testnet") {
    throw new Error(
      `Preview builds must use testnet, got NEXT_PUBLIC_STELLAR_NETWORK="${network}".`,
    );
  }

  const backend = env.NEXT_PUBLIC_BACKEND_URL?.trim().toLowerCase() ?? "";
  const offending = PRODUCTION_HOSTS.find((host) => backend.includes(host));
  if (offending) {
    throw new Error(
      `Preview builds must not point at production; NEXT_PUBLIC_BACKEND_URL contains "${offending}".`,
    );
  }
}
