import { describe, expect, it } from "vitest";
import {
  scrubErrorPayload,
  scrubValue,
  REDACTED,
} from "../../lib/observability/scrub";

// A real-shaped Stellar public key (G + 55 base32 chars).
const ADDRESS = "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H";

describe("scrubErrorPayload — the address never survives", () => {
  it("removes a wallet address from the message", () => {
    const out = scrubErrorPayload(
      new Error(`wallet ${ADDRESS} failed to connect`),
    );
    expect(JSON.stringify(out)).not.toContain(ADDRESS);
    expect(out.message).toContain(REDACTED);
  });

  it("removes addresses from the stack trace", () => {
    const err = new Error("boom");
    err.stack = `Error: boom\n  at sign (${ADDRESS})\n  at main`;
    const out = scrubErrorPayload(err);
    expect(JSON.stringify(out)).not.toContain(ADDRESS);
  });

  it("removes addresses and sensitive keys from nested context", () => {
    const out = scrubErrorPayload(new Error("submit failed"), {
      route: "/disputes/new",
      address: ADDRESS,
      request: { body: { reason: "long text", from: ADDRESS } },
      nested: [{ note: `paid ${ADDRESS}` }],
    });

    const serialised = JSON.stringify(out);
    expect(serialised).not.toContain(ADDRESS);
    expect(out.context?.address).toBe(REDACTED);
    expect(out.context?.route).toBe("/disputes/new");
  });

  it("coerces non-Error throwables", () => {
    expect(scrubErrorPayload("string failure").message).toBe("string failure");
    expect(scrubErrorPayload(42).name).toBe("Error");
  });
});

describe("scrubValue", () => {
  it("drops request bodies, headers and auth wherever they appear", () => {
    const out = scrubValue({
      ok: 1,
      headers: { authorization: "Bearer x" },
      requestBody: { secret: "s" },
      params: { id: "1" },
    }) as Record<string, unknown>;
    expect(out.ok).toBe(1);
    expect(out.headers).toBe(REDACTED);
    expect(out.requestBody).toBe(REDACTED);
    expect(out.params).toBe(REDACTED);
  });

  it("handles cyclic references without throwing", () => {
    const cyclic: Record<string, unknown> = { a: 1 };
    cyclic.self = cyclic;
    expect(() => scrubValue(cyclic)).not.toThrow();
  });

  it("redacts contract ids but leaves ordinary text alone", () => {
    const cId = "C" + "A".repeat(55); // C-prefixed 56-char id
    expect(scrubValue(`deployed ${cId}`)).toBe(`deployed ${REDACTED}`);
    // A short string that merely starts with C is untouched.
    expect(scrubValue("Contract deployed")).toBe("Contract deployed");
  });
});
