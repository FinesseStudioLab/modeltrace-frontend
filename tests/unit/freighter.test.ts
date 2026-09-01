/**
 * tests/unit/freighter.test.ts
 *
 * Unit tests for the pure/testable parts of lib/wallet/freighter.ts:
 * network matching, labelling, and the localStorage intent flag. The
 * Freighter-calling functions (connectWallet, readExistingConnection, …) are
 * exercised indirectly through tests/unit/freighter-connect.test.tsx, where
 * mocking the module lets each state be driven directly.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  networkLabel,
  networkMatches,
  readConnectIntent,
  resolveExpectedNetwork,
  writeConnectIntent,
} from "../../lib/wallet/freighter";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("resolveExpectedNetwork", () => {
  it("defaults to testnet when unset", () => {
    expect(resolveExpectedNetwork({})).toBe("testnet");
  });

  it("returns public only for an exact 'public' value", () => {
    expect(resolveExpectedNetwork({ NEXT_PUBLIC_STELLAR_NETWORK: "public" })).toBe("public");
    expect(resolveExpectedNetwork({ NEXT_PUBLIC_STELLAR_NETWORK: "PUBLIC" })).toBe("public");
  });

  it("falls back to testnet for any other value, including typos", () => {
    expect(resolveExpectedNetwork({ NEXT_PUBLIC_STELLAR_NETWORK: "pubic" })).toBe("testnet");
    expect(resolveExpectedNetwork({ NEXT_PUBLIC_STELLAR_NETWORK: "" })).toBe("testnet");
  });
});

describe("networkMatches", () => {
  it("matches TESTNET case-insensitively against the testnet expectation", () => {
    expect(networkMatches("TESTNET", "testnet")).toBe(true);
    expect(networkMatches("testnet", "testnet")).toBe(true);
    expect(networkMatches(" TestNet ", "testnet")).toBe(true);
  });

  it("matches PUBLIC against the public expectation", () => {
    expect(networkMatches("PUBLIC", "public")).toBe(true);
  });

  it("rejects mainnet when testnet is expected — the case the issue is about", () => {
    expect(networkMatches("PUBLIC", "testnet")).toBe(false);
  });

  it("rejects testnet when mainnet is expected", () => {
    expect(networkMatches("TESTNET", "public")).toBe(false);
  });

  it("never matches FUTURENET against either expectation", () => {
    expect(networkMatches("FUTURENET", "testnet")).toBe(false);
    expect(networkMatches("FUTURENET", "public")).toBe(false);
  });
});

describe("networkLabel", () => {
  it("labels PUBLIC as Mainnet — the label a demo audience actually reads", () => {
    expect(networkLabel("PUBLIC")).toBe("Mainnet");
  });

  it("labels TESTNET as Testnet", () => {
    expect(networkLabel("testnet")).toBe("Testnet");
  });

  it("labels FUTURENET as Futurenet", () => {
    expect(networkLabel("FUTURENET")).toBe("Futurenet");
  });

  it("falls back to the raw value for anything unrecognised", () => {
    expect(networkLabel("STANDALONE")).toBe("STANDALONE");
  });

  it("falls back to 'Unknown network' for an empty string", () => {
    expect(networkLabel("")).toBe("Unknown network");
  });
});

describe("connect intent persistence", () => {
  it("reads false when nothing has been written", () => {
    expect(readConnectIntent()).toBe(false);
  });

  it("round-trips true", () => {
    writeConnectIntent(true);
    expect(readConnectIntent()).toBe(true);
  });

  it("clears on writeConnectIntent(false) rather than storing 'false'", () => {
    writeConnectIntent(true);
    writeConnectIntent(false);
    expect(readConnectIntent()).toBe(false);
    expect(window.localStorage.getItem("modeltrace:wallet-connect-intent")).toBeNull();
  });

  it("degrades to false rather than throwing when localStorage is unavailable", () => {
    const spy = vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    expect(readConnectIntent()).toBe(false);
    spy.mockRestore();
  });
});
