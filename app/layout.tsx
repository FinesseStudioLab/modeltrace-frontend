import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { isPreviewDeployment, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { resolveSiteUrl } from "@/lib/site-url";
import { getStructuredData, serializeJsonLd } from "@/lib/structured-data";
import "./globals.css";

const siteUrl = resolveSiteUrl();
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: isPreviewDeployment()
    ? { index: false, follow: false }
    : { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

const nav = [
  ["Product", "/product"],
  ["Contracts", "/contracts"],
  ["Operators", "/operators"],
  ["Compliance", "/compliance"],
  ["Roadmap", "/roadmap"],
  ["Contributors", "/contributors"],
  ["Docs", "/docs"],
] as const;

/* eslint-disable react/no-danger -- JSON-LD is serialized with '<' escaped before injection. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = getStructuredData();

  return (
    <html lang="en">
      <body className={inter.variable}>
        {/* Serialized by serializeJsonLd, which escapes '<' to prevent script injection. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        <header className="nav">
          <div className="container nav-inner">
            <Link href="/" className="brand brand-with-logo">
              <Image
                src="/icon.svg"
                alt=""
                width={38}
                height={38}
                className="nav-logo"
                unoptimized
              />
              <span className="brand-text">ModelTrace</span>
            </Link>
            <nav className="links">
              {nav.map(([label, href]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
/* eslint-enable react/no-danger */
