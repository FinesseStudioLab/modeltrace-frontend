import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "../../lib/site-url";

describe("site metadata", () => {
  it("uses an explicit public site URL when configured", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://modeltrace.example/",
      }),
    ).toBe("https://modeltrace.example");
  });

  it("falls back to Vercel's deployment URL for previews", () => {
    expect(
      resolveSiteUrl({
        VERCEL_URL: "modeltrace-git-main-finesse.vercel.app",
      }),
    ).toBe("https://modeltrace-git-main-finesse.vercel.app");
  });

  it("keeps localhost as the local-only fallback", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });

  it("sets canonical and Open Graph URLs in the root metadata", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");

    expect(layout).toContain("metadataBase: new URL(siteUrl)");
    expect(layout).toContain("canonical: \"/\"");
    expect(layout).toContain("url: \"/\"");
  });
});
