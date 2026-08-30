"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/observability/report";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, { boundary: "app/error", digest: error.digest });
  }, [error]);

  return (
    <section className="landing-hero" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className="hero-headline">Something went wrong</h1>
      <p className="landing-lead">We&apos;ve encountered an unexpected issue and our team has been notified.</p>
      <div className="landing-cta-row" style={{ justifyContent: "center" }}>
        <button onClick={() => reset()} className="cta" style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "1rem" }}>Try again</button>
      </div>
    </section>
  );
}
