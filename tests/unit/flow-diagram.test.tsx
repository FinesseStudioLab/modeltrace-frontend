import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlowDiagram } from "../../components/flow-diagram";

describe("FlowDiagram", () => {
  it("names all three stages in order", () => {
    render(<FlowDiagram />);

    const stages = screen.getAllByText(/^(Attest|Meter|Settle)$/);
    expect(stages.map((el) => el.textContent)).toEqual(["Attest", "Meter", "Settle"]);
  });

  it("is labelled as a single image for screen readers", () => {
    render(<FlowDiagram />);
    const canvas = screen.getByRole("img");

    expect(canvas.getAttribute("aria-label")).toContain("Audit Registry");
    expect(canvas.getAttribute("aria-label")).toContain("Payment Router");
  });

  it("carries the flow as text, not just as a picture", () => {
    render(<FlowDiagram />);
    const steps = screen.getAllByRole("listitem");

    expect(steps.length).toBeGreaterThanOrEqual(3);
    // Each name appears in the visual canvas and in the step list — the
    // picture and the text both carry the same flow.
    expect(screen.getAllByText("Audit Registry").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Payment Router").length).toBeGreaterThanOrEqual(2);
  });
});
