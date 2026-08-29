"use client";

/**
 * components/wallet/freighter-connect.tsx
 *
 * Freighter wallet connection widget for the header.
 *
 * The README calls this a "wallet-ready path": what a hackathon demo needs is
 * not just a working connect button but every *other* state handled with its
 * own message and next action, because a demo audience sees exactly those
 * states — extension missing, locked, wrong network — far more often than
 * the happy path.
 *
 * States, and why each gets distinct UI:
 *   checking      — probing on mount; a blank header looks broken mid-load.
 *   not-installed — the single most common "it doesn't work" report from a
 *                   first-time visitor; the fix is a link, not a retry.
 *   disconnected  — extension present, this origin not (yet) granted access.
 *                   Covers "locked" too: Freighter unlocks as part of its own
 *                   permission flow, so from the page's perspective locked
 *                   and not-yet-allowed look identical until the click.
 *   wrong-network — connected, but on a network the app was not built for.
 *                   Rendered as an alert, not a subtle badge: per the issue,
 *                   mistaking mainnet for testnet mid-demo is the expensive
 *                   failure mode this component exists to prevent.
 *   connected     — truncated address + a network label that cannot be
 *                   mistaken for anything else.
 *   error         — a Freighter call failed for a reason that isn't one of
 *                   the above; retryable rather than a dead end.
 *
 * No secret key ever reaches this component. Every call goes through
 * lib/wallet/freighter.ts, whose only outputs are a public address and
 * (elsewhere, for signing) a signed XDR string.
 */

import { useCallback, useEffect, useId, useState } from "react";
import {
  connectWallet,
  disconnectWallet,
  detectExtension,
  networkLabel,
  networkMatches,
  readConnectIntent,
  readExistingConnection,
  resolveExpectedNetwork,
  type WalletInfo,
} from "@/lib/wallet/freighter";

type Status =
  | { kind: "checking" }
  | { kind: "not-installed" }
  | { kind: "disconnected" }
  | { kind: "connecting" }
  | { kind: "connected"; wallet: WalletInfo }
  | { kind: "wrong-network"; wallet: WalletInfo }
  | { kind: "error"; message: string };

const FREIGHTER_INSTALL_URL = "https://www.freighter.app/";

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

export function FreighterConnect() {
  const [status, setStatus] = useState<Status>({ kind: "checking" });
  const expectedNetwork = resolveExpectedNetwork();
  const liveId = useId();

  const evaluate = useCallback((wallet: WalletInfo): Status => {
    return networkMatches(wallet.network, expectedNetwork)
      ? { kind: "connected", wallet }
      : { kind: "wrong-network", wallet };
  }, [expectedNetwork]);

  // On mount: check silently. Only ever read-only calls here — requestAccess
  // is reserved for the click handler, see the module doc above.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const installed = await detectExtension();
      if (cancelled) return;
      if (!installed) {
        setStatus({ kind: "not-installed" });
        return;
      }

      // Only probe for an existing session if the user connected before —
      // otherwise every first-time visitor pays the cost of a wallet round
      // trip for a "not allowed" result we could have skipped.
      if (!readConnectIntent()) {
        setStatus({ kind: "disconnected" });
        return;
      }

      const existing = await readExistingConnection();
      if (cancelled) return;
      setStatus(existing.ok ? evaluate(existing.value) : { kind: "disconnected" });
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [evaluate]);

  const handleConnect = useCallback(async () => {
    setStatus({ kind: "connecting" });
    const result = await connectWallet();
    if (!result.ok) {
      if (result.reason === "not-installed") {
        setStatus({ kind: "not-installed" });
      } else if (result.reason === "rejected") {
        setStatus({ kind: "disconnected" });
      } else {
        setStatus({ kind: "error", message: result.message });
      }
      return;
    }
    setStatus(evaluate(result.value));
  }, [evaluate]);

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    setStatus({ kind: "disconnected" });
  }, []);

  return (
    <div className="wallet-connect" data-state={status.kind}>
      {renderStatus(status, {
        expectedLabel: networkLabel(expectedNetwork === "public" ? "PUBLIC" : "TESTNET"),
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        liveId,
      })}
      {/* Announces state changes for screen-reader users without moving focus. */}
      <span id={liveId} role="status" aria-live="polite" className="sr-only">
        {statusAnnouncement(status)}
      </span>
    </div>
  );
}

interface RenderCtx {
  expectedLabel: string;
  onConnect: () => void;
  onDisconnect: () => void;
  liveId: string;
}

function renderStatus(status: Status, ctx: RenderCtx) {
  switch (status.kind) {
    case "checking":
      return (
        <span className="wallet-pill" aria-hidden>
          Checking wallet…
        </span>
      );

    case "not-installed":
      return (
        <a
          href={FREIGHTER_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="wallet-pill wallet-pill-action"
        >
          Install Freighter
        </a>
      );

    case "disconnected":
      return (
        <button type="button" className="wallet-pill wallet-pill-action" onClick={ctx.onConnect}>
          Connect wallet
        </button>
      );

    case "connecting":
      return (
        <span className="wallet-pill" aria-hidden>
          Connecting…
        </span>
      );

    case "wrong-network":
      return (
        <div className="wallet-pill wallet-pill-alert" role="alert">
          <span className="wallet-network-badge wallet-network-badge-wrong">
            {networkLabel(status.wallet.network)}
          </span>
          <span>Switch Freighter to {ctx.expectedLabel} to continue</span>
        </div>
      );

    case "connected":
      return (
        <button
          type="button"
          className="wallet-pill wallet-pill-connected"
          onClick={ctx.onDisconnect}
          title="Click to disconnect"
        >
          <span className="wallet-network-badge">{networkLabel(status.wallet.network)}</span>
          <span className="wallet-address" title={status.wallet.address}>
            {truncateAddress(status.wallet.address)}
          </span>
        </button>
      );

    case "error":
      return (
        <div className="wallet-pill wallet-pill-alert" role="alert">
          <span>{status.message}</span>
          <button type="button" className="wallet-retry" onClick={ctx.onConnect}>
            Retry
          </button>
        </div>
      );
  }
}

function statusAnnouncement(status: Status): string {
  switch (status.kind) {
    case "connected":
      return `Wallet connected on ${networkLabel(status.wallet.network)}`;
    case "wrong-network":
      return `Wallet connected on the wrong network: ${networkLabel(status.wallet.network)}`;
    case "not-installed":
      return "Freighter is not installed";
    case "error":
      return `Wallet error: ${status.message}`;
    default:
      return "";
  }
}
