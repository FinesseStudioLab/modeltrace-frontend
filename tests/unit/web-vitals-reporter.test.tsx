/**
 * tests/unit/web-vitals-reporter.test.tsx
 */

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WebVitalsReporter } from "../../components/analytics/web-vitals-reporter";
import * as analytics from "../../lib/analytics";

// next/web-vitals' hook subscribes to the real browser PerformanceObserver
// machinery, which jsdom doesn't implement. Mocking it to synchronously
// invoke the callback with a fixture metric is what lets this test assert on
// WebVitalsReporter's own logic (rounding, event shape) rather than on
// whether jsdom can produce a real LCP measurement — it can't.
let capturedCallback: ((metric: { name: string; value: number; rating: string }) => void) | null =
  null;

vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: typeof capturedCallback) => {
    capturedCallback = cb;
  },
}));

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, track: vi.fn() };
});

const mockedTrack = vi.mocked(analytics.track);

afterEach(() => {
  capturedCallback = null;
  vi.clearAllMocks();
});

describe("<WebVitalsReporter>", () => {
  it("renders nothing", () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container.innerHTML).toBe("");
  });

  it("forwards a duration metric to track(), rounded to whole milliseconds", () => {
    render(<WebVitalsReporter />);
    capturedCallback!({ name: "LCP", value: 1234.567, rating: "good" });

    expect(mockedTrack).toHaveBeenCalledWith("Web Vitals", {
      metric: "LCP",
      rating: "good",
      value: 1235,
    });
  });

  it("rounds CLS to three decimal places rather than to a whole number", () => {
    // CLS is a unitless score, typically well under 1 — rounding it to the
    // nearest integer would collapse "good" and "poor" scores to the same 0.
    render(<WebVitalsReporter />);
    capturedCallback!({ name: "CLS", value: 0.12345, rating: "needs-improvement" });

    expect(mockedTrack).toHaveBeenCalledWith("Web Vitals", {
      metric: "CLS",
      rating: "needs-improvement",
      value: 0.123,
    });
  });
});
