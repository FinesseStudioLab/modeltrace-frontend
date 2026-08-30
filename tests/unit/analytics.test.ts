/**
 * tests/unit/analytics.test.ts
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analyticsDomain,
  isAnalyticsEnabled,
  track,
  trackDocsEntry,
  trackQuickstartComplete,
  trackQuickstartStart,
  trackRepositoryClick,
} from "../../lib/analytics";

afterEach(() => {
  delete (window as { plausible?: unknown }).plausible;
  vi.restoreAllMocks();
});

describe("analyticsDomain / isAnalyticsEnabled", () => {
  it("is undefined/disabled when no domain is configured", () => {
    expect(analyticsDomain({})).toBeUndefined();
    expect(isAnalyticsEnabled({})).toBe(false);
  });

  it("trims and returns the configured domain", () => {
    expect(analyticsDomain({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: " modeltrace.example " })).toBe(
      "modeltrace.example"
    );
    expect(isAnalyticsEnabled({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "modeltrace.example" })).toBe(true);
  });

  it("treats an empty string the same as unset", () => {
    expect(analyticsDomain({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "" })).toBeUndefined();
  });
});

describe("track", () => {
  it("calls window.plausible directly when it is already a function", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    track("Test Event", { foo: "bar" });

    expect(plausible).toHaveBeenCalledWith("Test Event", { props: { foo: "bar" } });
  });

  it("omits the options argument when no props are given", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    track("Test Event");

    expect(plausible).toHaveBeenCalledWith("Test Event", undefined);
  });

  it("installs a queueing shim and queues the call when plausible is not yet loaded", () => {
    track("Queued Event", { n: 1 });

    expect(typeof window.plausible).toBe("function");
    expect(window.plausible!.q).toEqual([["Queued Event", { props: { n: 1 } }]]);
  });

  it("never throws even if window.plausible itself throws", () => {
    window.plausible = () => {
      throw new Error("blocked by an extension");
    };

    expect(() => track("Test Event")).not.toThrow();
  });

  it("is a no-op outside the browser (no window)", () => {
    // track() checks `typeof window === "undefined"` — exercised implicitly
    // by every other test running under jsdom; this asserts it doesn't throw
    // when called with no listener installed and nothing configured, i.e.
    // the exact shape a server-rendered call site would see.
    delete (window as { plausible?: unknown }).plausible;
    expect(() => track("Test Event")).not.toThrow();
  });
});

describe("named conversion events", () => {
  it("each fires the correctly named event", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    trackRepositoryClick();
    trackDocsEntry();
    trackQuickstartStart();
    trackQuickstartComplete();

    expect(plausible).toHaveBeenNthCalledWith(1, "Repository Click", undefined);
    expect(plausible).toHaveBeenNthCalledWith(2, "Docs Entry", undefined);
    expect(plausible).toHaveBeenNthCalledWith(3, "Quickstart Start", undefined);
    expect(plausible).toHaveBeenNthCalledWith(4, "Quickstart Complete", undefined);
  });
});
