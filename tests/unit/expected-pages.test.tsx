import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExpectedPages } from "../../components/expected-pages";

describe("ExpectedPages", () => {
  it("renders the route table with a header row", () => {
    render(<ExpectedPages />);
    const table = screen.getByRole("table");

    expect(within(table).getByText("Route")).toBeInTheDocument();
    expect(within(table).getByText("Purpose")).toBeInTheDocument();
    expect(within(table).getByText("Status")).toBeInTheDocument();
  });

  it("lists every route the site navigation links to", () => {
    // This table is described in the component as the contract between
    // product and engineering, so a route disappearing from it silently is
    // exactly the regression worth catching.
    render(<ExpectedPages />);
    const table = screen.getByRole("table");

    for (const route of [
      "/",
      "/product",
      "/contracts",
      "/operators",
      "/compliance",
      "/roadmap",
      "/contributors",
      "/docs",
    ]) {
      expect(within(table).getByText(route)).toBeInTheDocument();
    }
  });

  it("marks each route with a delivery status", () => {
    render(<ExpectedPages />);
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);

    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const status = within(row).getAllByRole("cell").at(-1);
      expect(status?.textContent).toMatch(/^(Scaffold|Planned|Shipped)$/);
    }
  });
});
