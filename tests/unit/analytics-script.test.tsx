/**
 * tests/unit/analytics-script.test.tsx
 */

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyticsScript } from "../../components/analytics/analytics-script";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, analyticsDomain: vi.fn() };
});

const mocked = vi.mocked(analytics);

afterEach(() => {
  vi.clearAllMocks();
});

describe("<AnalyticsScript>", () => {
  it("renders nothing when no domain is configured", () => {
    mocked.analyticsDomain.mockReturnValue(undefined);
    const { container } = render(<AnalyticsScript />);
    expect(container.innerHTML).toBe("");
  });

  it("injects the Plausible script tag with the configured domain", async () => {
    // next/script with strategy="afterInteractive" loads the tag into
    // document.head via its own effect, not into the render() container, so
    // this asserts against the document rather than the returned container.
    mocked.analyticsDomain.mockReturnValue("modeltrace.example");
    render(<AnalyticsScript />);

    const script = await vi.waitUntil(() =>
      document.querySelector('script[src="https://plausible.io/js/script.js"]')
    );
    expect(script).toHaveAttribute("data-domain", "modeltrace.example");
  });
});
