/**
 * tests/unit/site-footer.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../../components/site-footer";

describe("<SiteFooter>", () => {
  it("links to the project's own repository", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: "View source on GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/FinesseStudioLab/modeltrace-frontend");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
