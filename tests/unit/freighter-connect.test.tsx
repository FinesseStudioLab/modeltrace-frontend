/**
 * tests/unit/freighter-connect.test.tsx
 *
 * Drives <FreighterConnect> through every state named in issue #60 by
 * mocking lib/wallet/freighter.ts directly, rather than mocking
 * @stellar/freighter-api two layers down. That keeps these tests about what
 * the component renders for a given wallet state, not about the shape of the
 * third-party SDK.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FreighterConnect } from "../../components/wallet/freighter-connect";
import * as freighter from "../../lib/wallet/freighter";

vi.mock("../../lib/wallet/freighter", async () => {
  const actual = await vi.importActual<typeof import("../../lib/wallet/freighter")>(
    "../../lib/wallet/freighter"
  );
  return {
    ...actual,
    detectExtension: vi.fn(),
    readExistingConnection: vi.fn(),
    connectWallet: vi.fn(),
    disconnectWallet: vi.fn(),
    readConnectIntent: vi.fn(),
  };
});

const mocked = vi.mocked(freighter);

const TESTNET_WALLET = {
  address: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVW",
  network: "TESTNET",
  networkPassphrase: "Test SDF Network ; September 2015",
};

const MAINNET_WALLET = { ...TESTNET_WALLET, network: "PUBLIC" };

afterEach(() => {
  vi.clearAllMocks();
});

describe("<FreighterConnect> — extension not installed", () => {
  it("shows an install link, not a connect button", async () => {
    mocked.detectExtension.mockResolvedValue(false);

    render(<FreighterConnect />);

    const link = await screen.findByRole("link", { name: "Install Freighter" });
    expect(link).toHaveAttribute("href", "https://www.freighter.app/");
    expect(screen.queryByRole("button", { name: "Connect wallet" })).toBeNull();
  });
});

describe("<FreighterConnect> — installed, no prior connection", () => {
  it("shows a Connect wallet button without probing for an existing session", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(false);

    render(<FreighterConnect />);

    await screen.findByRole("button", { name: "Connect wallet" });
    // No prior intent recorded, so the read-only reconnect check must not run —
    // it would cost every first-time visitor a wallet round trip for nothing.
    expect(mocked.readExistingConnection).not.toHaveBeenCalled();
  });

  it("connects on click and shows the truncated address and network", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(false);
    mocked.connectWallet.mockResolvedValue({ ok: true, value: TESTNET_WALLET });

    const user = userEvent.setup();
    render(<FreighterConnect />);

    await user.click(await screen.findByRole("button", { name: "Connect wallet" }));

    const connected = await screen.findByTitle("Click to disconnect");
    expect(connected).toBeInTheDocument();
    expect(screen.getByText("Testnet")).toBeInTheDocument();
    expect(screen.getByText("GABCDE…RSTUVW")).toBeInTheDocument();
  });

  it("a rejected connection request returns to the disconnected state, not an error", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(false);
    mocked.connectWallet.mockResolvedValue({
      ok: false,
      reason: "rejected",
      message: "User declined access",
    });

    const user = userEvent.setup();
    render(<FreighterConnect />);
    await user.click(await screen.findByRole("button", { name: "Connect wallet" }));

    expect(await screen.findByRole("button", { name: "Connect wallet" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("an unexpected failure surfaces as a retryable error", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(false);
    mocked.connectWallet.mockResolvedValue({
      ok: false,
      reason: "unknown",
      message: "Network request failed",
    });

    const user = userEvent.setup();
    render(<FreighterConnect />);
    await user.click(await screen.findByRole("button", { name: "Connect wallet" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Network request failed");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

describe("<FreighterConnect> — returning visitor (prior connect intent)", () => {
  it("silently restores the connected state without a click", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(true);
    mocked.readExistingConnection.mockResolvedValue({ ok: true, value: TESTNET_WALLET });

    render(<FreighterConnect />);

    await screen.findByText("Testnet");
    expect(mocked.connectWallet).not.toHaveBeenCalled();
  });

  it("falls back to the disconnected state if the prior session is gone", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(true);
    mocked.readExistingConnection.mockResolvedValue({
      ok: false,
      reason: "not-allowed",
      message: "Not connected yet.",
    });

    render(<FreighterConnect />);

    expect(await screen.findByRole("button", { name: "Connect wallet" })).toBeInTheDocument();
  });
});

describe("<FreighterConnect> — wrong network", () => {
  it("renders a prominent alert naming both networks, not a subtle badge", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(true);
    mocked.readExistingConnection.mockResolvedValue({ ok: true, value: MAINNET_WALLET });

    render(<FreighterConnect />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Mainnet");
    expect(alert).toHaveTextContent(/switch freighter to testnet/i);
  });
});

describe("<FreighterConnect> — connected", () => {
  it("clicking the connected pill disconnects and forgets the intent flag", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(true);
    mocked.readExistingConnection.mockResolvedValue({ ok: true, value: TESTNET_WALLET });

    const user = userEvent.setup();
    render(<FreighterConnect />);

    const connected = await screen.findByTitle("Click to disconnect");
    await user.click(connected);

    expect(mocked.disconnectWallet).toHaveBeenCalledOnce();
    expect(await screen.findByRole("button", { name: "Connect wallet" })).toBeInTheDocument();
  });
});

describe("<FreighterConnect> — accessibility announcements", () => {
  it("announces the connected state in an aria-live region", async () => {
    mocked.detectExtension.mockResolvedValue(true);
    mocked.readConnectIntent.mockReturnValue(true);
    mocked.readExistingConnection.mockResolvedValue({ ok: true, value: TESTNET_WALLET });

    render(<FreighterConnect />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Wallet connected on Testnet");
    });
  });
});
