const LOCAL_SITE_URL = "http://localhost:3000";

type SiteUrlEnv = Record<string, string | undefined>;

function normalizeUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function resolveSiteUrl(env: SiteUrlEnv = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return normalizeUrl(env.NEXT_PUBLIC_SITE_URL.trim());
  }

  if (env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    return normalizeUrl(env.VERCEL_PROJECT_PRODUCTION_URL.trim());
  }

  if (env.VERCEL_URL?.trim()) {
    return normalizeUrl(env.VERCEL_URL.trim());
  }

  return LOCAL_SITE_URL;
}
