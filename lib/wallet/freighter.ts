/**
 * lib/wallet/freighter.ts
 *
 * Thin, testable layer between `<FreighterConnect>` and `@stellar/freighter-api`.
 *
 * Nothing in this file touches key material — Freighter holds the secret key
 * inside the extension and only ever hands back a public address or a signed
 * XDR blob. That is the whole point of using it: the browser bundle can never
 * see, request, or transmit a secret key, by construction.
 *
 * The functions here are deliberately dumb wrappers plus a couple of pure
 * helpers (`networkMatches`, label formatting). Wrapping keeps every call site
 * in the component free of try/catch boilerplate and gives tests a single
 * module to mock instead of reaching into `@stellar/freighter-api` directly.
 */

import freighterApi, { isBrowser } from "@stellar/freighter-api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** The network label ModelTrace expects, sourced from NEXT_PUBLIC_STELLAR_NETWORK. */
export type ExpectedNetwork = "testnet" | "public";

export interface WalletInfo {
  address: string;
  /** Freighter's own network name, e.g. "TESTNET", "PUBLIC", "FUTURENET". */
  network: string;
  networkPassphrase: string;
}

export type FreighterResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "not-installed" | "not-allowed" | "rejected" | "unknown"; message: string };

// ─── Config ─────────────────────────────────────────────────────────────────

/**
 * Which network the app expects the wallet to be on, read once at module
 * load. Defaults to testnet — the safer default for a project whose README
 * explicitly warns that demoing against the wrong network is expensive.
 */
export function resolveExpectedNetwork(
  env: Record<string, string | undefined> = process.env
): ExpectedNetwork {
  const raw = env.NEXT_PUBLIC_STELLAR_NETWORK?.trim().toLowerCase();
  return raw === "public" ? "public" : "testnet";
}

/**
 * Freighter reports networks as "TESTNET" / "PUBLIC" / "FUTURENET" (and this
 * has varied in case across versions), so comparison is case-insensitive and
 * only two of the three Freighter values are considered a match for either
 * expected network — FUTURENET never matches, which is intentional so an
 * unusual network the app was never built for surfaces as a mismatch rather
 * than silently passing.
 */
export function networkMatches(freighterNetwork: string, expected: ExpectedNetwork): boolean {
  const normalized = freighterNetwork.trim().toUpperCase();
  return expected === "public" ? normalized === "PUBLIC" : normalized === "TESTNET";
}

/** Human label for the network badge, capitalised consistently either way. */
export function networkLabel(network: string): string {
  const normalized = network.trim().toUpperCase();
  if (normalized === "PUBLIC") return "Mainnet";
  if (normalized === "TESTNET") return "Testnet";
  if (normalized === "FUTURENET") return "Futurenet";
  return network || "Unknown network";
}

// ─── localStorage intent flag ──────────────────────────────────────────────
//
// Not a session, not an address, not a key — a single boolean saying "the
// last thing this browser did here was connect". On mount the component uses
// it to decide whether to *quietly* re-check the read-only APIs (isAllowed /
// getAddress) so a returning user doesn't have to click Connect again after a
// refresh. It never triggers requestAccess() on its own: that opens the
// extension's permission popup, and doing that without a fresh user gesture
// is both bad UX and blocked by some browsers.

const INTENT_KEY = "modeltrace:wallet-connect-intent";

export function readConnectIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INTENT_KEY) === "true";
  } catch {
    // localStorage can throw in private-browsing / storage-partitioned
    // contexts. Treat that the same as "no intent recorded".
    return false;
  }
}

export function writeConnectIntent(intent: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (intent) {
      window.localStorage.setItem(INTENT_KEY, "true");
    } else {
      window.localStorage.removeItem(INTENT_KEY);
    }
  } catch {
    // Same as above — storage being unavailable degrades to "always ask
    // the user to click Connect again", which is safe, just less smooth.
  }
}

// ─── Freighter calls ────────────────────────────────────────────────────────

/**
 * Whether the Freighter extension is present in this browser at all.
 * `@stellar/freighter-api` exposes `isBrowser` for environments where the
 * check cannot run (SSR, non-browser test runners) — treated as "not
 * installed" rather than throwing, since there is nothing to install there.
 */
export async function detectExtension(): Promise<boolean> {
  if (!isBrowser) return false;
  try {
    const result = await freighterApi.isConnected();
    if (result.error) return false;
    return result.isConnected;
  } catch {
    return false;
  }
}

/**
 * Read-only reconnect check: has this origin already been granted access,
 * and if so, what is the current address and network? Never prompts.
 */
export async function readExistingConnection(): Promise<FreighterResult<WalletInfo>> {
  try {
    const allowed = await freighterApi.isAllowed();
    if (allowed.error || !allowed.isAllowed) {
      return { ok: false, reason: "not-allowed", message: "Not connected yet." };
    }

    const [addressResult, networkResult] = await Promise.all([
      freighterApi.getAddress(),
      freighterApi.getNetwork(),
    ]);

    if (addressResult.error || !addressResult.address) {
      return { ok: false, reason: "unknown", message: describeError(addressResult.error) };
    }
    if (networkResult.error) {
      return { ok: false, reason: "unknown", message: describeError(networkResult.error) };
    }

    return {
      ok: true,
      value: {
        address: addressResult.address,
        network: networkResult.network,
        networkPassphrase: networkResult.networkPassphrase,
      },
    };
  } catch (err) {
    return { ok: false, reason: "unknown", message: describeError(err) };
  }
}

/**
 * Prompts Freighter for access — the only call in this module that shows UI
 * in the extension, so it must only ever run from a click handler.
 */
export async function connectWallet(): Promise<FreighterResult<WalletInfo>> {
  try {
    const access = await freighterApi.requestAccess();
    if (access.error || !access.address) {
      return {
        ok: false,
        reason: classifyAccessError(access.error),
        message: describeError(access.error) || "Connection request was not completed.",
      };
    }

    const networkResult = await freighterApi.getNetwork();
    if (networkResult.error) {
      return { ok: false, reason: "unknown", message: describeError(networkResult.error) };
    }

    writeConnectIntent(true);

    return {
      ok: true,
      value: {
        address: access.address,
        network: networkResult.network,
        networkPassphrase: networkResult.networkPassphrase,
      },
    };
  } catch (err) {
    return { ok: false, reason: "unknown", message: describeError(err) };
  }
}

export function disconnectWallet(): void {
  // Freighter has no programmatic "revoke" call — access is granted and
  // revoked from the extension's own UI. Disconnecting here means forgetting
  // our own intent flag so the app stops auto-reconnecting; the extension's
  // permission for this origin is untouched.
  writeConnectIntent(false);
}

// ─── Error shaping ──────────────────────────────────────────────────────────

function classifyAccessError(error: unknown): "rejected" | "not-installed" | "unknown" {
  const message = describeError(error).toLowerCase();
  if (message.includes("not found") || message.includes("not installed")) return "not-installed";
  if (message.includes("declined") || message.includes("denied") || message.includes("reject")) {
    return "rejected";
  }
  return "unknown";
}

function describeError(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Something went wrong talking to Freighter.";
}
