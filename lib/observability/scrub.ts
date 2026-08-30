/**
 * Payload scrubbing for the error tracker (issue #76).
 *
 * ModelTrace is privacy-forward: the error tracker must never become the leak.
 * Before any error payload is sent it passes through {@link scrubErrorPayload},
 * which strips wallet addresses and request data wherever they appear —
 * message strings, stack frames, and nested context objects.
 *
 * The guarantee that matters is behavioural, and is asserted by
 * `tests/unit/scrub.test.ts`: a known address string never survives scrubbing.
 */

export const REDACTED = "[redacted]";

/**
 * Stellar public keys / contract ids: base32 (Crockford, RFC-4648 alphabet
 * without 0/1/8/9) starting `G` (accounts) or `C` (contracts), 56 chars total.
 */
const STELLAR_ADDRESS = /\b[GC][A-Z2-7]{55}\b/g;

/** Keys whose values are dropped entirely regardless of content. */
const SENSITIVE_KEYS = new Set([
  "address",
  "publickey",
  "public_key",
  "secret",
  "secretkey",
  "seed",
  "mnemonic",
  "privatekey",
  "private_key",
  "authorization",
  "cookie",
  "body",
  "requestbody",
  "request_body",
  "payload",
  "headers",
  "params",
  "searchparams",
  "email",
]);

function scrubString(value: string): string {
  return value.replace(STELLAR_ADDRESS, REDACTED);
}

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase().replace(/[-\s]/g, "_")) ||
    SENSITIVE_KEYS.has(key.toLowerCase().replace(/[-\s_]/g, ""));
}

/**
 * Recursively scrub an arbitrary value. Strings have addresses masked;
 * objects have sensitive keys removed and every other value scrubbed in
 * turn. Cyclic references are handled. Depth is bounded so a pathological
 * payload can't hang the reporter.
 */
export function scrubValue(value: unknown, _seen?: WeakSet<object>, _depth = 0): unknown {
  const seen = _seen ?? new WeakSet<object>();

  if (typeof value === "string") return scrubString(value);
  if (typeof value !== "object" || value === null) return value;
  if (_depth >= 8) return REDACTED;
  if (seen.has(value)) return REDACTED;
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item, seen, _depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      out[key] = REDACTED;
      continue;
    }
    out[key] = scrubValue(val, seen, _depth + 1);
  }
  return out;
}

export interface ScrubbedError {
  name: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

/** Scrub an Error (plus optional structured context) into a safe payload. */
export function scrubErrorPayload(
  error: unknown,
  context?: Record<string, unknown>,
): ScrubbedError {
  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === "string" ? error : "Unknown error");

  return {
    name: err.name,
    message: scrubString(err.message),
    ...(err.stack ? { stack: scrubString(err.stack) } : {}),
    ...(context
      ? { context: scrubValue(context) as Record<string, unknown> }
      : {}),
  };
}
