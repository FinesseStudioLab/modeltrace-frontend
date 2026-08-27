/**
 * i18n entry point.
 *
 * For now we only ship English, so locale resolution always returns "en".
 * The shape here is deliberately minimal: when a second locale lands, the
 * only change needed is to (a) add the message file and (b) make
 * `resolveLocale` read from the request/cookie instead of hard-coding "en".
 *
 * Usage in Server Components:
 *
 *   import { getMessages } from "@/lib/i18n";
 *   const m = getMessages();
 *   // m.nav.brand, m.panelStates.loading, …
 *
 * Usage in Client Components:
 *
 *   import { useMessages } from "@/lib/i18n";
 *   const m = useMessages();
 */

import * as en from "./messages/en";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The full message catalogue type — one locale's worth of strings. */
export type Messages = typeof en;

/** All supported locale codes. Extend this union when adding new locales. */
export type Locale = "en";

// ---------------------------------------------------------------------------
// Locale metadata
// ---------------------------------------------------------------------------

/**
 * Per-locale metadata needed by the HTML shell and Right-to-Left layouts.
 *
 * `dir` drives the <html dir="…"> attribute. RTL locales ("ar", "he", "fa"
 * etc.) would be listed here so the layout never has to contain that logic.
 */
export const LOCALE_META: Record<Locale, { dir: "ltr" | "rtl"; label: string }> = {
  en: { dir: "ltr", label: "English" },
};

/** The default locale — also the only active one for now. */
export const DEFAULT_LOCALE: Locale = "en";

// ---------------------------------------------------------------------------
// Message resolution
// ---------------------------------------------------------------------------

const catalogues: Record<Locale, Messages> = { en };

/**
 * Resolves the active locale.
 *
 * When Next.js i18n routing is wired up this would read
 * `headers().get("x-next-intl-locale")` or similar. Until then it returns
 * the default so callers don't have to change when that wiring is added.
 */
export function resolveLocale(): Locale {
  // Future: read from request context / cookies / headers here.
  return DEFAULT_LOCALE;
}

/**
 * Returns the message catalogue for the current locale.
 *
 * Safe to call in Server Components, API routes, or anywhere outside React.
 */
export function getMessages(locale: Locale = resolveLocale()): Messages {
  return catalogues[locale];
}

// ---------------------------------------------------------------------------
// Client-side hook
// ---------------------------------------------------------------------------

/**
 * React hook for Client Components.
 *
 * Returns the message catalogue for the current locale. Because the locale is
 * static for now, this is just a thin wrapper around `getMessages()`. When
 * locale switching is introduced, swap this for a Context-based
 * implementation without touching any call site.
 */
export function useMessages(): Messages {
  // No React import needed — this is a plain function that happens to be
  // called from within a component. Upgrade to useContext() when needed.
  return getMessages();
}
