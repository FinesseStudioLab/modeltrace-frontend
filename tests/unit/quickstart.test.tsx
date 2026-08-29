/**
 * tests/unit/quickstart.test.tsx
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Quickstart } from "../../components/analytics/quickstart";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, trackQuickstartStart: vi.fn(), trackQuickstartComplete: vi.fn() };
});

const mockedStart = vi.mocked(analytics.trackQuickstartStart);
const mockedComplete = vi.mocked(analytics.trackQuickstartComplete);

// jsdom does not implement IntersectionObserver. This fake captures every
// instance's callback so a test can decide when the section "becomes
// visible" instead of depending on real layout, which jsdom cannot compute.
let observed: Array<{ callback: IntersectionObserverCallback; disconnect: () => void }> = [];

class FakeIntersectionObserver {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe() {
    observed.push({ callback: this.callback, disconnect: this.disconnect.bind(this) });
  }
  disconnect() {
    observed = observed.filter((entry) => entry.callback !== this.callback);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function fireIntersection(isIntersecting: boolean) {
  observed.forEach(({ callback }) =>
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

describe("<Quickstart>", () => {
  it("does not fire trackQuickstartStart before the section is visible", () => {
    render(<Quickstart />);
    expect(mockedStart).not.toHaveBeenCalled();
  });

  it("fires trackQuickstartStart the first time the section intersects", () => {
    render(<Quickstart />);
    fireIntersection(true);
    expect(mockedStart).toHaveBeenCalledOnce();
  });

  it("does not fire a second time on a later intersection", () => {
    render(<Quickstart />);
    fireIntersection(true);
    fireIntersection(true);
    expect(mockedStart).toHaveBeenCalledOnce();
  });

  it("does not fire on a non-intersecting entry", () => {
    render(<Quickstart />);
    fireIntersection(false);
    expect(mockedStart).not.toHaveBeenCalled();
  });

  it("fires trackQuickstartComplete when the repository link is clicked", async () => {
    const user = userEvent.setup();
    render(<Quickstart />);

    await user.click(screen.getByRole("link", { name: "Open the repository" }));

    expect(mockedComplete).toHaveBeenCalledOnce();
  });

  it("does not fire trackQuickstartComplete twice on repeated clicks", async () => {
    const user = userEvent.setup();
    render(<Quickstart />);

    const link = screen.getByRole("link", { name: "Open the repository" });
    await user.click(link);
    await user.click(link);

    expect(mockedComplete).toHaveBeenCalledOnce();
  });

  it("the repository link opens in a new tab safely", () => {
    render(<Quickstart />);
    const link = screen.getByRole("link", { name: "Open the repository" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
