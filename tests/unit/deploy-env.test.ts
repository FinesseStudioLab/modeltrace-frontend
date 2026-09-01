import { describe, expect, it } from "vitest";
import {
  assertPreviewTargetsAreSafe,
  isPreview,
  resolveDeployEnv,
  resolveNetwork,
} from "../../lib/deploy-env";

describe("deploy environment", () => {
  it("reads the explicit variable first", () => {
    expect(resolveDeployEnv({ NEXT_PUBLIC_DEPLOY_ENV: "preview" })).toBe("preview");
    expect(resolveDeployEnv({ NEXT_PUBLIC_DEPLOY_ENV: "production" })).toBe("production");
  });

  it("falls back to Vercel's own signal when the explicit one is missing", () => {
    // A preview must still be recognised as one if the workflow forgets to set
    // the variable, because the consequence is an indexed preview.
    expect(resolveDeployEnv({ NEXT_PUBLIC_VERCEL_ENV: "preview" })).toBe("preview");
  });

  it("treats an unrecognised value as not-a-preview rather than guessing", () => {
    expect(resolveDeployEnv({ NEXT_PUBLIC_DEPLOY_ENV: "staging", NODE_ENV: "production" })).toBe(
      "production",
    );
  });

  it("pins previews to testnet regardless of what is configured", () => {
    expect(
      resolveNetwork({ NEXT_PUBLIC_DEPLOY_ENV: "preview", NEXT_PUBLIC_STELLAR_NETWORK: "public" }),
    ).toBe("testnet");
  });

  it("reports preview state", () => {
    expect(isPreview({ NEXT_PUBLIC_DEPLOY_ENV: "preview" })).toBe(true);
    expect(isPreview({ NEXT_PUBLIC_DEPLOY_ENV: "production" })).toBe(false);
  });
});

describe("preview target guard", () => {
  it("rejects a preview pointed at a non-testnet network", () => {
    expect(() =>
      assertPreviewTargetsAreSafe({
        NEXT_PUBLIC_DEPLOY_ENV: "preview",
        NEXT_PUBLIC_STELLAR_NETWORK: "public",
      }),
    ).toThrow(/must use testnet/);
  });

  it("rejects a preview pointed at a production backend", () => {
    expect(() =>
      assertPreviewTargetsAreSafe({
        NEXT_PUBLIC_DEPLOY_ENV: "preview",
        NEXT_PUBLIC_BACKEND_URL: "https://api.modeltrace.example/v1",
      }),
    ).toThrow(/must not point at production/);
  });

  it("accepts a correctly configured preview", () => {
    expect(() =>
      assertPreviewTargetsAreSafe({
        NEXT_PUBLIC_DEPLOY_ENV: "preview",
        NEXT_PUBLIC_STELLAR_NETWORK: "testnet",
        NEXT_PUBLIC_BACKEND_URL: "https://staging.example/v1",
      }),
    ).not.toThrow();
  });

  it("does not constrain production builds", () => {
    expect(() =>
      assertPreviewTargetsAreSafe({
        NEXT_PUBLIC_DEPLOY_ENV: "production",
        NEXT_PUBLIC_STELLAR_NETWORK: "public",
      }),
    ).not.toThrow();
  });
});
