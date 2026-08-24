import { describe, expect, it } from "vitest";
import {
  CONTRACT_META,
  DEPLOYMENTS,
  hasLiveDeployments,
} from "../../app/contracts/deployments";

const SLUGS = ["audit-registry", "usage-meter", "payment-router"] as const;

describe("deployment registry", () => {
  it("covers every network with exactly the three contracts", () => {
    expect(DEPLOYMENTS.map((n) => n.network)).toEqual(["testnet", "mainnet"]);

    for (const network of DEPLOYMENTS) {
      expect(network.contracts.map((c) => c.slug)).toEqual([...SLUGS]);
    }
  });

  it("documents every deployed contract in CONTRACT_META", () => {
    for (const slug of SLUGS) {
      const meta = CONTRACT_META[slug];
      expect(meta).toBeDefined();
      expect(meta.name.length).toBeGreaterThan(0);
      expect(meta.holds.length).toBeGreaterThan(0);
      expect(meta.rationale.length).toBeGreaterThan(0);
      expect(meta.sourceUrl).toMatch(/^https:\/\/github\.com\/FinesseStudioLab\/modeltrace-contract\//);
    }
  });

  it("holds no unverifiable addresses today", () => {
    // The registry is the honest source of truth: until modeltrace-contract#62
    // lands, every value must be null. A fake address on this page would
    // contradict the page's entire "verify it yourself" promise.
    expect(hasLiveDeployments()).toBe(false);
    for (const network of DEPLOYMENTS) {
      for (const contract of network.contracts) {
        expect(contract.address).toBeNull();
        expect(contract.wasmHash).toBeNull();
      }
    }
  });

  it("accepts only well-formed Soroban ids once the registry lands", () => {
    // The invariant that must hold the day real deployments are pasted in:
    // a Stellar contract id is a base32 string starting with C, 56 chars long.
    const stellarContractId = /^C[A-Z2-7]{55}$/;
    for (const network of DEPLOYMENTS) {
      for (const contract of network.contracts) {
        if (contract.address !== null) {
          expect(contract.address).toMatch(stellarContractId);
        }
      }
    }
  });

  it("points each network at its own explorer", () => {
    const byNetwork = Object.fromEntries(DEPLOYMENTS.map((n) => [n.network, n.explorerUrl]));
    expect(byNetwork.testnet).toContain("testnet");
    expect(byNetwork.mainnet).not.toContain("testnet");
  });
});
