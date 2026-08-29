"use client";

import { useEffect } from "react";
import { useMessages } from "@/lib/i18n";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const m = useMessages();
  const ep = m.errorPage;

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught:", error);
  }, [error]);

  return (
    <section className="landing-hero" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className="hero-headline">{ep.headline}</h1>
      <p className="landing-lead">{ep.body}</p>
      <div className="landing-cta-row" style={{ justifyContent: "center" }}>
        <button onClick={() => reset()} className="cta" style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "1rem" }}>{ep.cta}</button>
      </div>
    </section>
  );
}
