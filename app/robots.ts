import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/deploy-env";

/**
 * Previews are disallowed wholesale so they cannot compete with production in
 * search results. robots.txt alone is advisory and does not stop a linked page
 * being indexed, so the preview also sends X-Robots-Tag: noindex from
 * next.config.ts — this is the half crawlers read before fetching.
 */
export default function robots(): MetadataRoute.Robots {
  if (isPreview()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  // No sitemap is advertised: the app has no sitemap route, and pointing
  // crawlers at a 404 is worse than omitting the line.
  return { rules: [{ userAgent: "*", allow: "/" }] };
}
