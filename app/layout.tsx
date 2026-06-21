import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "ModelTrace",
    template: "%s | " + "ModelTrace",
  },
  description: "Verifiable AI inference accounting on Stellar.",
  applicationName: "ModelTrace",
  openGraph: {
    title: "ModelTrace",
    description: "Verifiable AI inference accounting on Stellar.",
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
  ["Compliance", "/compliance"],
  ["Roadmap", "/roadmap"],
  ["Contributors", "/contributors"],
  ["Docs", "/docs"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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

// patch: 2026-06-09T11:08:34.285718

// patch: 2026-06-21T16:17:08.571435
