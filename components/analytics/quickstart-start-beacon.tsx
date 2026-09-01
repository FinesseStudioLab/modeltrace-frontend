"use client";

/**
 * components/analytics/quickstart-start-beacon.tsx
 *
 * Fires trackQuickstartStart() once, on mount. The integration guide
 * (app/docs/integration/page.tsx) *is* ModelTrace's quickstart — run the web
 * app, optionally run it against the API, quality gates — so visiting that
 * page is what "starting" the quickstart means.
 */

import { useEffect, useRef } from "react";
import { trackQuickstartStart } from "@/lib/analytics";

export function QuickstartStartBeacon() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackQuickstartStart();
  }, []);

  return null;
}
