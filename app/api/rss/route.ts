import { getAllEntries } from "@/lib/changelog";
import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FEED_TITLE = "ModelTrace Changelog";
const FEED_DESCRIPTION =
  "Progress notes, architecture decisions, and postmortems for ModelTrace.";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

export async function GET() {
  const entries = getAllEntries();

  const items = entries
    .map((entry) => {
      const link = `${SITE_URL}/changelog/${entry.slug}`;
      const categories = [
        ...(entry.milestone ? [`<category>${escapeXml(entry.milestone)}</category>`] : []),
        ...entry.tags.map((t) => `<category>${escapeXml(t)}</category>`),
      ].join("\n        ");

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(entry.summary)}</description>
      <pubDate>${toRfc822(entry.date)}</pubDate>
      ${categories}
    </item>`;
    })
    .join("");

  const lastBuild =
    entries.length > 0 ? toRfc822(entries[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}/changelog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL)}/api/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
