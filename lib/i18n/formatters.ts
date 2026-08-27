/**
 * Locale-aware formatting helpers.
 *
 * Every date, number, and currency that the application shows to a user must
 * go through one of these. The rules:
 *
 *  1. Never hard-code "en-US" (or any other locale tag) at a call site.
 *  2. Never use `.toLocaleString()` without a locale argument — the implicit
 *     browser/server locale is non-deterministic across environments.
 *  3. Provide the locale as a parameter so that when a second locale ships,
 *     no call sites change.
 *
 * The helpers are plain functions (not React hooks) so they can be used in
 * Server Components, `getServerSideProps`, API routes, and tests equally.
 *
 * All formatters accept an optional `locale` parameter and fall back to the
 * result of `resolveLocale()` from the i18n index.
 */

import { resolveLocale, type Locale } from "./index";

// ---------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------

/**
 * Formats an integer or decimal with locale-appropriate digit grouping.
 *
 * `1000000` → "1,000,000" in en, "1.000.000" in de.
 */
export function formatNumber(value: number, locale: Locale = resolveLocale()): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Compact notation for large counts — axis labels, stat tiles.
 *
 * `45200` → "45.2K" in en, "45,2 Tsd." in de.
 *
 * `maximumFractionDigits` defaults to 1 to match the existing SettlementsPanel
 * behaviour and avoid rounding surprises (e.g. 1.95K vs 2K).
 */
export function formatCompact(
  value: number,
  locale: Locale = resolveLocale(),
  maximumFractionDigits = 1,
): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
}

/**
 * Percentage display.
 *
 * Accepts the ratio (0–1) or a pre-multiplied percent integer.
 * Pass `alreadyMultiplied: true` when the value is 0–100.
 *
 *   formatPercent(0.875)          → "87.5%"
 *   formatPercent(88, _, true)    → "88%"
 */
export function formatPercent(
  value: number,
  locale: Locale = resolveLocale(),
  alreadyMultiplied = false,
): string {
  const ratio = alreadyMultiplied ? value / 100 : value;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);
}

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

/**
 * Formats a monetary amount.
 *
 * `formatCurrency(1000.5, "USD")`
 *   → "$1,000.50" in en-US
 *   → "1.000,50 $" in de-DE
 *
 * The currency code is explicit rather than derived from locale because a
 * user in Germany may be invoiced in USD. Do not conflate locale with
 * currency.
 */
export function formatCurrency(
  value: number,
  currency: string,
  locale: Locale = resolveLocale(),
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Dates & times
// ---------------------------------------------------------------------------

/**
 * Short time display — e.g. "3:42 PM" in en, "15:42" in de.
 *
 * Used in the attestations table "Time" column.
 */
export function formatTime(
  date: Date | string,
  locale: Locale = resolveLocale(),
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: undefined, // let the locale decide
  }).format(d);
}

/**
 * Short date display — e.g. "27 Aug 2026" in en, "27.08.2026" in de.
 */
export function formatDate(
  date: Date | string,
  locale: Locale = resolveLocale(),
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Full date + time — useful for audit log timestamps where ambiguity matters.
 *
 * e.g. "27 Aug 2026, 15:42:08"
 */
export function formatDateTime(
  date: Date | string,
  locale: Locale = resolveLocale(),
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: undefined,
  }).format(d);
}

// ---------------------------------------------------------------------------
// Template interpolation
// ---------------------------------------------------------------------------

/**
 * Lightweight placeholder replacement for message strings.
 *
 *   interpolate("Used {used} of {limit}", { used: "690", limit: "800" })
 *   → "Used 690 of 800"
 *
 * This intentionally avoids a full ICU library — the catalogue only needs
 * basic positional substitution for now. Upgrade to a proper ICU formatter
 * (e.g. `@formatjs/intl-messageformat`) only when plural rules or gender
 * inflection become necessary.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce<string>(
    (str, [key, val]) => str.replaceAll(`{${key}}`, String(val)),
    template,
  );
}
