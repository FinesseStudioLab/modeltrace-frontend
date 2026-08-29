"use client";

/**
 * address-hash.tsx
 *
 * Shared primitives for displaying Stellar addresses and transaction/payload
 * hashes throughout ModelTrace.
 *
 * <Address> — 56-char Stellar base32 address
 * <Hash>    — transaction or payload hash (hex, typically 64 chars)
 *
 * Both components:
 *   • Truncate showing BOTH head and tail (tail distinguishes similar values)
 *   • Expose the full value in `title` and `aria-label` for hover / AT
 *   • Provide a copy button with an accessible `aria-live` announcement
 *   • Render a safe fallback (—) when value is absent or empty
 *   • Accept an optional `explorerHref` for network-aware explorer links
 *   • Use monospace + tabular figures so columns of addresses align
 */

import { useCallback, useId, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressProps {
  /** Raw Stellar address (56 chars base32) or transaction / payload hash. */
  value?: string | null;
  /** Number of leading characters to display. @default 6 */
  head?: number;
  /** Number of trailing characters to display. @default 6 */
  tail?: number;
  /**
   * Absolute URL to the relevant Stellar explorer page.
   * When present the truncated text becomes a link that opens in a new tab.
   */
  explorerHref?: string;
  /** Forwarded to the outermost element. */
  className?: string;
}

export interface HashProps extends AddressProps {
  /** @default 8 */
  head?: number;
  /** @default 8 */
  tail?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Duration (ms) the "Copied!" feedback stays visible before resetting. */
const COPY_RESET_MS = 2000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(value: string, head: number, tail: number): string {
  // Only truncate if the string is actually longer than head + tail.
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}\u2026${value.slice(-tail)}`;
}

// ─── Core implementation ──────────────────────────────────────────────────────

interface CoreProps {
  value?: string | null;
  head: number;
  tail: number;
  explorerHref?: string;
  className?: string;
  /** Accessible label used on the copy button, e.g. "Copy address" */
  copyLabel: string;
}

function AddressCore({
  value,
  head,
  tail,
  explorerHref,
  className,
  copyLabel,
}: CoreProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unique ID so the aria-live region can be associated without collisions
  // when multiple instances are on the same page.
  const liveId = useId();

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // Clipboard API can be blocked (e.g. in sandboxed iframes).
      // Silently ignore — the title/aria-label still lets users select & copy.
    }
  }, [value]);

  // ── Missing / empty guard ──────────────────────────────────────────────────
  if (!value) {
    return (
      <span
        className={className}
        aria-label="value not available"
        title="value not available"
        style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}
      >
        —
      </span>
    );
  }

  // ── Normal render ──────────────────────────────────────────────────────────
  const display = truncate(value, head, tail);

  const codeContent = explorerHref ? (
    <a
      href={explorerHref}
      target="_blank"
      rel="noopener noreferrer"
      className="addr-link"
      tabIndex={0}
    >
      {display}
    </a>
  ) : (
    display
  );

  return (
    <span className={`addr-root${className ? ` ${className}` : ""}`}>
      {/*
       * The <code> element carries title + aria-label so that both mouse-hover
       * and screen readers expose the full, untruncated value without the user
       * needing to click the copy button.
       */}
      <code
        className="addr-code"
        title={value}
        aria-label={value}
      >
        {codeContent}
      </code>

      {/* Copy button */}
      <button
        type="button"
        className="addr-copy"
        aria-label={copyLabel}
        aria-controls={liveId}
        data-copied={copied ? "true" : undefined}
        onClick={handleCopy}
      >
        {copied ? (
          // Checkmark — visually confirms success
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Clipboard icon
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <rect
              x="4"
              y="1"
              width="7"
              height="9"
              rx="1.2"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M4 3H2.5A1.5 1.5 0 0 0 1 4.5v6A1.5 1.5 0 0 0 2.5 12H7a1.5 1.5 0 0 0 1.5-1.5V10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/*
       * aria-live region — always in the DOM so the browser registers it
       * before any content change. Polite so it doesn't interrupt ongoing
       * announcements (e.g. navigation landmarks).
       */}
      <span
        id={liveId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {copied ? "Copied!" : ""}
      </span>
    </span>
  );
}

// ─── Public components ────────────────────────────────────────────────────────

/**
 * Renders a truncated Stellar address with head + tail characters visible,
 * a clipboard copy button, accessible copy confirmation, and an optional
 * network-aware explorer link.
 *
 * @example
 * // Minimal
 * <Address value="GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVW" />
 *
 * @example
 * // With explorer link
 * <Address
 *   value={contractId}
 *   explorerHref={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
 * />
 */
export function Address({
  value,
  head = 6,
  tail = 6,
  explorerHref,
  className,
}: AddressProps) {
  return (
    <AddressCore
      value={value}
      head={head}
      tail={tail}
      explorerHref={explorerHref}
      className={className}
      copyLabel="Copy address"
    />
  );
}

/**
 * Renders a truncated transaction or payload hash with wider defaults
 * (head=8, tail=8) than `<Address>`.
 *
 * @example
 * <Hash value={txHash} />
 *
 * @example
 * // With explorer link
 * <Hash
 *   value={txHash}
 *   explorerHref={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
 * />
 */
export function Hash({
  value,
  head = 8,
  tail = 8,
  explorerHref,
  className,
}: HashProps) {
  return (
    <AddressCore
      value={value}
      head={head}
      tail={tail}
      explorerHref={explorerHref}
      className={className}
      copyLabel="Copy hash"
    />
  );
}
