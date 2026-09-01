import type { ReactNode } from "react";

/**
 * Accessible form-field wrapper (issue #75).
 *
 * Owns the label/description/error wiring so every form — dispute filing,
 * export config, key management — associates them identically and correctly:
 * the control is labelled by `htmlFor`, and `aria-describedby` points at the
 * hint and/or error via {@link fieldAria}.
 */

export interface FieldProps {
  /** Stable id; the control inside must use `id={id}`. */
  id: string;
  label: string;
  /** Optional helper text rendered above the control. */
  hint?: string;
  /** Validation message. When set, the field is marked invalid. */
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function hintId(id: string): string {
  return `${id}-hint`;
}

export function errorId(id: string): string {
  return `${id}-error`;
}

/**
 * The `aria-*` props a control should spread onto itself so assistive tech
 * reads its hint and error. Keeps the wiring in one place instead of every
 * form re-deriving the id strings.
 */
export function fieldAria(
  id: string,
  opts: { hasHint?: boolean; hasError?: boolean },
): { "aria-describedby"?: string; "aria-invalid"?: true } {
  const describedBy = [
    opts.hasHint ? hintId(id) : null,
    opts.hasError ? errorId(id) : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(opts.hasError ? { "aria-invalid": true as const } : {}),
  };
}

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FieldProps) {
  return (
    <div className="form-field" data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className="form-field-label">
        {label}
        {required ? (
          <span aria-hidden className="form-field-required">
            {" *"}
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId(id)} className="form-field-hint">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId(id)} role="alert" className="form-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
