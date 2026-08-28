import { describe, expect, it } from "vitest";
import { explorerContractUrl, explorerTxUrl, lookupAttestation } from "../../lib/api/explore";

describe("lookupAttestation (mock fallback)", () => {
  it("finds a record by id", async () => {
    const result = await lookupAttestation("id", "att_1");
    expect(result.status).toBe("found");
    if (result.status === "found") {
      expect(result.record.model).toBe("gpt-oss-120b");
    }
  });

  it("finds a record by transaction hash", async () => {
    const byId = await lookupAttestation("id", "att_2");
    if (byId.status !== "found") throw new Error("expected fixture record");

    const result = await lookupAttestation("txHash", byId.record.txHash);
    expect(result.status).toBe("found");
    if (result.status === "found") {
      expect(result.record.id).toBe("att_2");
    }
  });

  it("finds a record by payload hash", async () => {
    const byId = await lookupAttestation("id", "att_3");
    if (byId.status !== "found") throw new Error("expected fixture record");

    const result = await lookupAttestation("payloadHash", byId.record.payloadHash);
    expect(result.status).toBe("found");
    if (result.status === "found") {
      expect(result.record.id).toBe("att_3");
    }
  });

  it("is case-insensitive", async () => {
    const result = await lookupAttestation("id", "ATT_1");
    expect(result.status).toBe("found");
  });

  it("returns not_found for an unknown query", async () => {
    const result = await lookupAttestation("id", "does-not-exist");
    expect(result).toEqual({ status: "not_found" });
  });

  it("returns not_found for a blank query", async () => {
    const result = await lookupAttestation("txHash", "   ");
    expect(result).toEqual({ status: "not_found" });
  });

  it("surfaces the supersession chain both directions", async () => {
    const corrected = await lookupAttestation("id", "att_3");
    const original = await lookupAttestation("id", "att_3_orig");

    if (corrected.status !== "found" || original.status !== "found") {
      throw new Error("expected fixture records");
    }

    expect(corrected.record.supersedes?.id).toBe("att_3_orig");
    expect(original.record.supersededBy?.id).toBe("att_3");
  });
});

describe("explorer links", () => {
  it("builds a transaction explorer link", () => {
    expect(explorerTxUrl("abc123")).toBe("https://stellar.expert/explorer/testnet/tx/abc123");
  });

  it("builds a contract explorer link", () => {
    expect(explorerContractUrl("CABC")).toBe(
      "https://stellar.expert/explorer/testnet/contract/CABC",
    );
  });
});
