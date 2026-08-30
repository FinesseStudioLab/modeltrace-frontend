import { scrubErrorPayload, type ScrubbedError } from "./scrub";

/**
 * Single entry point for reporting a client/server error (issue #76).
 *
 * Everything routes through {@link scrubErrorPayload} first, so wallet
 * addresses and request data can never reach the tracker. The actual
 * transport (Sentry with build-time source maps, release = commit SHA,
 * rate-based alerting) is layered on here without any call site changing.
 */

export interface ReportContext {
  /** Which error boundary or subsystem caught this. */
  boundary?: string;
  /** Next.js error digest, safe to keep — it is an opaque hash. */
  digest?: string;
  [key: string]: unknown;
}

export function captureError(
  error: unknown,
  context?: ReportContext,
): ScrubbedError {
  const safe = scrubErrorPayload(error, context);

  // Until the tracker DSN is wired, surface the *scrubbed* payload only.
  // eslint-disable-next-line no-console
  console.error("[captureError]", safe);

  return safe;
}
