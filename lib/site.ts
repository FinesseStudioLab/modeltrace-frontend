import { resolveSiteUrl } from "./site-url";

export const SITE_NAME = "ModelTrace";
export const SITE_DESCRIPTION = "Verifiable AI inference accounting on Stellar.";

export function getSiteUrl(): URL {
  return new URL(resolveSiteUrl());
}

export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
