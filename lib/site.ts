export const SITE_NAME = "ModelTrace";
export const SITE_DESCRIPTION = "Verifiable AI inference accounting on Stellar.";

const LOCAL_URL = "http://localhost:3000";

function absoluteUrl(value: string): URL {
  return new URL(value.includes("://") ? value : `https://${value}`);
}

export function getSiteUrl(): URL {
  const deploymentUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  return deploymentUrl ? absoluteUrl(deploymentUrl) : new URL(LOCAL_URL);
}

export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
