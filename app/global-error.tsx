"use client";

import { useEffect } from "react";
import "./globals.css";
import { captureError } from "@/lib/observability/report";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, { boundary: "app/global-error", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="container">
          <section className="landing-hero" style={{ textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 className="hero-headline">Critical Error</h1>
            <p className="landing-lead">A critical application error occurred. Our team has been notified.</p>
            <div className="landing-cta-row" style={{ justifyContent: "center" }}>
              <button onClick={() => reset()} className="cta" style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "1rem" }}>Refresh</button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
