import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Field,
  fieldAria,
  hintId,
  errorId,
} from "../../components/forms/field";
import { mapServerErrors } from "../../lib/forms/server-errors";

describe("Field a11y wiring", () => {
  it("associates label, hint and error with the control", () => {
    render(
      <Field id="reason" label="Reason" hint="Explain the dispute" error="Required">
        <textarea id="reason" {...fieldAria("reason", { hasHint: true, hasError: true })} />
      </Field>,
    );

    const control = screen.getByLabelText("Reason");
    expect(control).toHaveAttribute(
      "aria-describedby",
      `${hintId("reason")} ${errorId("reason")}`,
    );
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("omits describedby and invalid when there is no hint or error", () => {
    render(
      <Field id="name" label="Name">
        <input id="name" {...fieldAria("name", {})} />
      </Field>,
    );
    const control = screen.getByLabelText("Name");
    expect(control).not.toHaveAttribute("aria-describedby");
    expect(control).not.toHaveAttribute("aria-invalid");
  });
});

describe("mapServerErrors", () => {
  const fields = ["reason", "amount"] as const;

  it("maps a zod-style errors list onto known fields", () => {
    const result = mapServerErrors(
      { errors: [{ path: ["body", "amount"], message: "Must be positive" }] },
      fields,
    );
    expect(result.fieldErrors).toEqual({ amount: "Must be positive" });
    expect(result.formLevel).toBeNull();
  });

  it("maps a flat fieldErrors map and keeps the first message", () => {
    const result = mapServerErrors(
      { fieldErrors: { reason: ["Too short", "Also bad"] } },
      fields,
    );
    expect(result.fieldErrors.reason).toBe("Too short");
  });

  it("routes unknown fields to formLevel instead of dropping them", () => {
    const result = mapServerErrors(
      { errors: [{ path: "captcha", message: "Verification failed" }] },
      fields,
    );
    expect(result.fieldErrors).toEqual({});
    expect(result.formLevel).toBe("Verification failed");
  });

  it("falls back to the top-level message when nothing maps", () => {
    const result = mapServerErrors({ message: "Bad request" }, fields);
    expect(result.formLevel).toBe("Bad request");
  });

  it("tolerates a null body", () => {
    expect(mapServerErrors(null, fields)).toEqual({
      fieldErrors: {},
      formLevel: null,
    });
  });
});
