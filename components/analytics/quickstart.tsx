"use client";

/**
 * components/analytics/quickstart.tsx
 *
 * The docs page's own placeholder text said "replace with production
 * content ... and analytics" — this is that replacement. A three-step
 * quickstart with concrete conversion tracking:
 *
 *   - "start" fires the first time the section becomes visible (an
 *     IntersectionObserver, not a mount effect) — a component can mount
 *     off-screen during hydration or a route prefetch, and neither of those
 *     is a visitor actually starting the quickstart.
 *   - "complete" fires when the final step's link is clicked, which is the
 *     point where a reader has followed the flow through to something real
 *     (the repository) rather than only scrolled past it.
 *
 * Both fire at most once per page view — re-scrolling past the section or
 * re-clicking the link should not inflate the funnel.
 */

import { useEffect, useRef } from "react";
import { trackQuickstartComplete, trackQuickstartStart } from "@/lib/analytics";
import { RepositoryLink } from "@/components/analytics/tracked-links";

export function Quickstart() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const started = useRef(false);
  const completed = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (started.current) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          started.current = true;
          trackQuickstartStart();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleComplete() {
    if (completed.current) return;
    completed.current = true;
    trackQuickstartComplete();
  }

  return (
    <section className="quickstart" ref={sectionRef} aria-labelledby="quickstart-heading">
      <h3 id="quickstart-heading">Quickstart</h3>
      <ol className="quickstart-steps">
        <li>
          <strong>Clone the monorepo.</strong>{" "}
          <code>git clone https://github.com/FinesseStudioLab/modeltrace-frontend</code>
        </li>
        <li>
          <strong>Install and run the frontend.</strong>{" "}
          <code>npm ci &amp;&amp; npm run dev</code> — the app comes up on{" "}
          <code>localhost:3000</code> with no required environment variables.
        </li>
        <li>
          <strong>Connect Freighter on testnet</strong> using the wallet button in the header, then
          explore the source to see how attestations, settlement, and the wallet flow fit together.
        </li>
      </ol>
      <RepositoryLink
        href="https://github.com/FinesseStudioLab/modeltrace-frontend"
        className="cta-secondary"
        onClick={handleComplete}
      >
        Open the repository
      </RepositoryLink>
    </section>
  );
}
