"use client";

/**
 * components/analytics/analytics-script.tsx
 *
 * Loads the Plausible tracking script — only if a domain is configured, and
 * only Plausible's own script, nothing else. Plausible is cookieless and
 * collects no personal data by design, which is what "no cookie banner
 * needed" in the issue actually depends on: adding a second, less careful
 * script here later would quietly reopen that question.
 *
 * Rendered unconditionally from the root layout; the domain check happens
 * inside so the layout itself stays free of environment branching.
 */

import Script from "next/script";
import { analyticsDomain } from "@/lib/analytics";

export function AnalyticsScript() {
  const domain = analyticsDomain();
  if (!domain) return null;

  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={domain}
      strategy="afterInteractive"
    />
  );
}
