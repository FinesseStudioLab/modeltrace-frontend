import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "../../components/brand-logo";

describe("BrandLogo", () => {
  it("renders as decoration, not as content", () => {
    // The wordmark beside it already names the brand. If this logo were
    // exposed too, every screen reader would announce ModelTrace twice.
    const { container } = render(<BrandLogo />);
    const svg = container.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("forwards className so callers control sizing", () => {
    const { container } = render(<BrandLogo className="nav-logo" />);
    expect(container.querySelector("svg")).toHaveClass("nav-logo");
  });
});
