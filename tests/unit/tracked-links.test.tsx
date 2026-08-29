/**
 * tests/unit/tracked-links.test.tsx
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RepositoryLink } from "../../components/analytics/tracked-links";
import * as analytics from "../../lib/analytics";

vi.mock("../../lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../lib/analytics")>("../../lib/analytics");
  return { ...actual, trackRepositoryClick: vi.fn() };
});

const mocked = vi.mocked(analytics.trackRepositoryClick);

afterEach(() => {
  vi.clearAllMocks();
});

describe("<RepositoryLink>", () => {
  it("fires trackRepositoryClick on click", async () => {
    const user = userEvent.setup();
    render(<RepositoryLink href="https://github.com/example/repo">View source</RepositoryLink>);

    await user.click(screen.getByRole("link", { name: "View source" }));

    expect(mocked).toHaveBeenCalledOnce();
  });

  it("still calls a caller-supplied onClick after tracking", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <RepositoryLink href="https://github.com/example/repo" onClick={onClick}>
        View source
      </RepositoryLink>
    );

    await user.click(screen.getByRole("link", { name: "View source" }));

    expect(mocked).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("always opens in a new tab with a safe rel, regardless of caller props", () => {
    render(<RepositoryLink href="https://github.com/example/repo">View source</RepositoryLink>);
    const link = screen.getByRole("link", { name: "View source" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
