/**
 * tests/unit/quickstart-start-beacon.test.tsx
 */

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuickstartStartBeacon } from "../../components/analytics/quickstart-start-beacon";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, trackQuickstartStart: vi.fn() };
});

const mocked = vi.mocked(analytics.trackQuickstartStart);

afterEach(() => {
  vi.clearAllMocks();
});

describe("<QuickstartStartBeacon>", () => {
  it("renders nothing", () => {
    const { container } = render(<QuickstartStartBeacon />);
    expect(container.innerHTML).toBe("");
  });

  it("fires trackQuickstartStart exactly once on mount", () => {
    render(<QuickstartStartBeacon />);
    expect(mocked).toHaveBeenCalledOnce();
  });

  it("does not fire again on re-render", () => {
    const { rerender } = render(<QuickstartStartBeacon />);
    rerender(<QuickstartStartBeacon />);
    rerender(<QuickstartStartBeacon />);
    expect(mocked).toHaveBeenCalledOnce();
  });
});
