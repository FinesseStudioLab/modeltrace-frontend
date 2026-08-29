/**
 * tests/unit/quickstart-complete-beacon.test.tsx
 */

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuickstartCompleteBeacon } from "../../components/analytics/quickstart-complete-beacon";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, trackQuickstartComplete: vi.fn() };
});

const mocked = vi.mocked(analytics.trackQuickstartComplete);

// jsdom does not implement IntersectionObserver. This fake captures every
// instance's callback so a test can decide when the marker "becomes visible"
// instead of depending on real layout, which jsdom cannot compute.
let observed: IntersectionObserverCallback[] = [];

class FakeIntersectionObserver {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe() {
    observed.push(this.callback);
  }
  disconnect() {
    observed = observed.filter((cb) => cb !== this.callback);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function fireIntersection(isIntersecting: boolean) {
  observed.forEach((callback) =>
    callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      new FakeIntersectionObserver(() => {}) as unknown as IntersectionObserver
    )
  );
}

beforeEach(() => {
  observed = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("<QuickstartCompleteBeacon>", () => {
  it("renders an invisible marker, not visible content", () => {
    const { container } = render(<QuickstartCompleteBeacon />);
    expect(container.querySelector("span[aria-hidden]")).not.toBeNull();
    expect(container.textContent).toBe("");
  });

  it("does not fire before the marker is visible", () => {
    render(<QuickstartCompleteBeacon />);
    expect(mocked).not.toHaveBeenCalled();
  });

  it("fires trackQuickstartComplete the first time the marker intersects", () => {
    render(<QuickstartCompleteBeacon />);
    fireIntersection(true);
    expect(mocked).toHaveBeenCalledOnce();
  });

  it("does not fire a second time on a later intersection", () => {
    render(<QuickstartCompleteBeacon />);
    fireIntersection(true);
    fireIntersection(true);
    expect(mocked).toHaveBeenCalledOnce();
  });

  it("does not fire on a non-intersecting entry", () => {
    render(<QuickstartCompleteBeacon />);
    fireIntersection(false);
    expect(mocked).not.toHaveBeenCalled();
  });
});
