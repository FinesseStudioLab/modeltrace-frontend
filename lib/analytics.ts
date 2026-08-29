/**
 * lib/analytics.ts
 *
 * Cookieless analytics: a thin wrapper around Plausible's event API, chosen
 * for the reason the issue names — it collects no personal data and sets no
 * cookies, so there is no consent banner to build or defend, which matters
 * for a project whose own pitch is data minimisation.
 *
 * Nothing here is Plausible-specific by contract, though: every call site in
 * the app goes through `track()` or one of the named conversion helpers
 * below, never `window.plausible` directly, so swapping providers later is a
 * one-file change.
 *
 * With no domain configured (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` unset), every
 * function in this module is a silent no-op — local dev and forks of this
 * repo work exactly the same without a dashboard to point at.
 */

type EventProps = Record<string, string | number | boolean>;

type PlausibleFn = {
  (event: string, options?: { props?: EventProps }): void;
  q?: unknown[];
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** The domain Plausible is configured against, or undefined if analytics is off. */
export function analyticsDomain(env: Record<string, string | undefined> = process.env): string | undefined {
  return env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || undefined;
}

export function isAnalyticsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(analyticsDomain(env));
}

/**
 * Fires a custom event.
 *
 * Never throws — a click handler's analytics call must not be the reason the
 * click itself fails, and a page with analytics disabled or blocked (ad
 * blockers commonly target analytics scripts) must behave identically to one
 * with it enabled.
 *
 * If the Plausible script has not finished loading yet, this installs the
 * same queueing shim Plausible's own snippet uses: `window.plausible.q`
 * holds pending `[event, options]` calls that the real script drains on
 * init, so an event fired during initial hydration is queued rather than
 * silently dropped.
 */
export function track(eventName: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.plausible !== "function") {
      const queue: PlausibleFn = ((...args: unknown[]) => {
        (queue.q = queue.q || []).push(args);
      }) as PlausibleFn;
      window.plausible = window.plausible || queue;
    }
    window.plausible(eventName, props ? { props } : undefined);
  } catch {
    // See doc comment above: analytics failures must be invisible to the user.
  }
}

// ─── Named conversion events ────────────────────────────────────────────────
//
// Acceptance criterion: "Track the conversions that matter: repository
// clicks, docs entry, quickstart starts and completions." Each is a thin,
// named wrapper around track() rather than call sites passing raw strings, so
// the event vocabulary lives in exactly one place — a typo in an event name
// becomes a compile error here instead of a silent gap in a dashboard that
// nobody notices for months.

export function trackRepositoryClick(): void {
  track("Repository Click");
}

export function trackDocsEntry(): void {
  track("Docs Entry");
}

export function trackQuickstartStart(): void {
  track("Quickstart Start");
}

export function trackQuickstartComplete(): void {
  track("Quickstart Complete");
}
