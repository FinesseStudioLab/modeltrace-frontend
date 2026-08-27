import type { MetadataRoute } from "next";
import { publicRoutes } from "../lib/site-map";
import { getSiteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicRoutes.map(({ path }) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}
