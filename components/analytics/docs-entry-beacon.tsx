"use client";

/**
 * components/analytics/docs-entry-beacon.tsx
 *
 * Fires trackDocsEntry() once, on mount. Deliberately its own component
 * rather than an effect inside the (server) docs page — this is the entire
 * "use client" surface the page needs, so the page itself, its content, and
 * its metadata export can all stay server-rendered.
 */

import { useEffect, useRef } from "react";
import { trackDocsEntry } from "@/lib/analytics";

export function DocsEntryBeacon() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackDocsEntry();
  }, []);

  return null;
}
