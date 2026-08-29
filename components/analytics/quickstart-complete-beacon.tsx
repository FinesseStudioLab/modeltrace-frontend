"use client";

/**
 * components/analytics/quickstart-complete-beacon.tsx
 *
 * Fires trackQuickstartComplete() the first time this (invisible,
 * zero-footprint) marker scrolls into view. Placed at the end of the
 * integration guide's content, it is the same "did the reader reach the end"
 * signal a read-progress tracker uses, without needing one: reaching this
 * marker means they scrolled past every section of the guide, which is the
 * closest a docs page can get to "finished the quickstart" without an
 * explicit completion action to hook onto.
 */

import { useEffect, useRef } from "react";
import { trackQuickstartComplete } from "@/lib/analytics";

export function QuickstartCompleteBeacon() {
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = markerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      if (fired.current) return;
      if (entries.some((entry) => entry.isIntersecting)) {
        fired.current = true;
        trackQuickstartComplete();
        observer.disconnect();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <span ref={markerRef} aria-hidden style={{ position: "absolute" }} />;
}
