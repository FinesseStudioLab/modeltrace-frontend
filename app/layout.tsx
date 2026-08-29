import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { FreighterConnect } from "@/components/wallet/freighter-connect";
import Link from "next/link";
import { resolveSiteUrl } from "@/lib/site-url";
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
    default: "ModelTrace",
    template: "%s | " + "ModelTrace",
  },
  description: "Verifiable AI inference accounting on Stellar.",
  applicationName: "ModelTrace",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ModelTrace",
    description: "Verifiable AI inference accounting on Stellar.",
    url: "/",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ModelTrace",
    description: "Verifiable AI inference accounting on Stellar.",
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
  ["Explore", "/explore"],
  ["Compliance", "/compliance"],
  ["Roadmap", "/roadmap"],
  ["Contributors", "/contributors"],
  ["Docs", "/docs"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
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
            <FreighterConnect />
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
