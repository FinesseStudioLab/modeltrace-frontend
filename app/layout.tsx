import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsScript } from "@/components/analytics/analytics-script";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { SiteFooter } from "@/components/site-footer";
import { resolveSiteUrl } from "@/lib/site-url";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";
import "./a11y.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteNav />
        <main className="container">{children}</main>
        <SiteFooter />
        <AnalyticsScript />
        <WebVitalsReporter />
        <main className="container" id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
