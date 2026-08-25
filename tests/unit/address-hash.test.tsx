/**
 * tests/unit/address-hash.test.tsx
 *
 * Root cause of the original 3 failures:
 *
 * 1. Clipboard spy (0 calls) — @testing-library/user-event v14 replaces
 *    navigator.clipboard with its own virtual implementation inside
 *    userEvent.setup(). Our beforeEach mock was installed before setup()
 *    ran, so the component's `navigator.clipboard.writeText` call hit
 *    userEvent's clipboard, not our spy.
 *    Fix: vi.spyOn(navigator.clipboard, 'writeText') *after* setup() so we
 *    intercept whatever is currently installed.
 *
 * 2. Timer test timeout — `await user.click()` with vi.useFakeTimers() hangs
 *    because userEvent's internal async scheduling depends on real timers.
 *    Fix: use fireEvent.click() inside act() for the timer test; fireEvent
 *    is synchronous and doesn't touch the timer machinery.
 */

import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { Address, Hash } from "../../components/address-hash";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ─── Fixtures ──────────────────────────────────────────────────────────────────

// 56-char Stellar address (valid length; synthetic value)
const ADDR =
  "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVW";

// 64-char hex transaction hash (synthetic)
const TX_HASH =
  "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

// ─── Clipboard helper ──────────────────────────────────────────────────────────

/**
 * Returns a spy on navigator.clipboard.writeText.
 *
 * Must be called *after* userEvent.setup() because userEvent.setup() replaces
 * navigator.clipboard with its own virtual clipboard. Spying after setup()
 * means we intercept the object the component will actually call.
 */
function spyOnClipboard() {
  // userEvent may have replaced navigator.clipboard; ensure it exists first.
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    });
  }
  return vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue(undefined);
}

// ─── <Address> ────────────────────────────────────────────────────────────────

describe("<Address>", () => {
  it("renders a truncated form — head + ellipsis + tail", () => {
    render(<Address value={ADDR} head={6} tail={6} />);
    // Full value must NOT appear as text content
    expect(screen.queryByText(ADDR)).toBeNull();
    // Truncated form must appear: first 6 chars + … + last 6 chars
    const expected = `${ADDR.slice(0, 6)}\u2026${ADDR.slice(-6)}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("exposes the full value via aria-label and title", () => {
    render(<Address value={ADDR} />);
    const code = screen.getByLabelText(ADDR);
    expect(code).toHaveAttribute("title", ADDR);
  });

  it("renders the fallback (—) when value is null", () => {
    render(<Address value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByLabelText("value not available")).toBeInTheDocument();
  });

  it("renders the fallback (—) when value is undefined", () => {
    render(<Address />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders the fallback (—) when value is an empty string", () => {
    render(<Address value="" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("has a copy button labelled for screen readers", () => {
    render(<Address value={ADDR} />);
    const btn = screen.getByRole("button", { name: "Copy address" });
    expect(btn).toBeInTheDocument();
  });

  it("clicking the copy button writes the full value to the clipboard", async () => {
    // Set up userEvent first, THEN spy — so we catch userEvent's clipboard.
    const user = userEvent.setup();
    render(<Address value={ADDR} />);
    const writeSpy = spyOnClipboard();

    await user.click(screen.getByRole("button", { name: "Copy address" }));

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy).toHaveBeenCalledWith(ADDR);
  });

  it("announces 'Copied!' in an aria-live region after clicking copy", async () => {
    const user = userEvent.setup();
    render(<Address value={ADDR} />);
    spyOnClipboard();

    const live = screen.getByRole("status");
    expect(live).toHaveTextContent("");

    await user.click(screen.getByRole("button", { name: "Copy address" }));
    expect(live).toHaveTextContent("Copied!");
  });

  it("the aria-live region resets after 2 s", async () => {
    vi.useFakeTimers();
    // fireEvent is synchronous — no internal timer scheduling that would
    // conflict with vi.useFakeTimers(). Wrap in act() to flush the state
    // update that sets copied=true.
    render(<Address value={ADDR} />);
    spyOnClipboard();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy address" }));
      // Drain microtasks so the awaited clipboard promise resolves and
      // setCopied(true) is called before we check.
      await Promise.resolve();
    });
    expect(screen.getByRole("status")).toHaveTextContent("Copied!");

    // Advance past the 2 000 ms reset timer and flush React.
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("renders no explorer link when explorerHref is omitted", () => {
    render(<Address value={ADDR} />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders an explorer link when explorerHref is supplied", () => {
    const href = `https://stellar.expert/explorer/testnet/contract/${ADDR}`;
    render(<Address value={ADDR} explorerHref={href} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("respects custom head / tail values", () => {
    render(<Address value={ADDR} head={4} tail={4} />);
    const expected = `${ADDR.slice(0, 4)}\u2026${ADDR.slice(-4)}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});

// ─── <Hash> ───────────────────────────────────────────────────────────────────

describe("<Hash>", () => {
  it("defaults to head=8 and tail=8", () => {
    render(<Hash value={TX_HASH} />);
    const expected = `${TX_HASH.slice(0, 8)}\u2026${TX_HASH.slice(-8)}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("has a copy button labelled for screen readers", () => {
    render(<Hash value={TX_HASH} />);
    expect(
      screen.getByRole("button", { name: "Copy hash" })
    ).toBeInTheDocument();
  });

  it("clicking the copy button writes the full hash to the clipboard", async () => {
    const user = userEvent.setup();
    render(<Hash value={TX_HASH} />);
    const writeSpy = spyOnClipboard();

    await user.click(screen.getByRole("button", { name: "Copy hash" }));

    expect(writeSpy).toHaveBeenCalledWith(TX_HASH);
  });

  it("renders the fallback (—) when value is null", () => {
    render(<Hash value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders an explorer link when explorerHref is supplied", () => {
    const href = `https://stellar.expert/explorer/testnet/tx/${TX_HASH}`;
    render(<Hash value={TX_HASH} explorerHref={href} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", href);
  });
});
