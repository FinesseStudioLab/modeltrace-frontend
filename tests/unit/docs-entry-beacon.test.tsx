/**
 * tests/unit/docs-entry-beacon.test.tsx
 */

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocsEntryBeacon } from "../../components/analytics/docs-entry-beacon";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, trackDocsEntry: vi.fn() };
});

const mocked = vi.mocked(analytics.trackDocsEntry);

afterEach(() => {
  vi.clearAllMocks();
});

describe("<DocsEntryBeacon>", () => {
  it("renders nothing", () => {
    const { container } = render(<DocsEntryBeacon />);
    expect(container.innerHTML).toBe("");
  });

  it("fires trackDocsEntry exactly once on mount", () => {
    render(<DocsEntryBeacon />);
    expect(mocked).toHaveBeenCalledOnce();
  });

  it("does not fire again on re-render", () => {
    const { rerender } = render(<DocsEntryBeacon />);
    rerender(<DocsEntryBeacon />);
    rerender(<DocsEntryBeacon />);
    expect(mocked).toHaveBeenCalledOnce();
  });
});
