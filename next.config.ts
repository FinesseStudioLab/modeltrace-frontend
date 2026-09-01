import type { NextConfig } from "next";
import { isPreview } from "./lib/deploy-env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // robots.txt asks crawlers not to fetch; this tells them not to index what
  // they reach by following a link from elsewhere. Previews need both.
  async headers() {
    if (!isPreview()) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
