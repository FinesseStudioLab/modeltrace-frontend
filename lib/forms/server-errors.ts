/**
 * Map backend validation errors onto individual form fields (issue #75).
 *
 * The API returns field-scoped validation problems; the UI must show each
 * message next to its field rather than dumping a banner, and must keep the
 * user's input intact across the failure. This module is the pure mapping
 * layer both concerns build on.
 */

/** Field name -> error message, ready to feed into `<Field error={...}>`. */
export type FieldErrors<Field extends string = string> = Partial<
  Record<Field, string>
>;

/**
 * Shape a JSON error body can take. Supports the two common conventions:
 * a flat `{ field: message }` map, or an `errors: [{ path, message }]` list
 * (RFC-7807 / zod `flatten()` style).
 */
export interface ApiErrorBody {
  message?: string;
  errors?: Array<{ path?: string | Array<string | number>; message?: string }>;
  fieldErrors?: Record<string, string | string[]>;
}

function normalisePath(path: string | Array<string | number> | undefined): string | null {
  if (path == null) return null;
  if (Array.isArray(path)) {
    const parts = path.filter((p) => p !== "");
    return parts.length > 0 ? String(parts[parts.length - 1]) : null;
  }
  const trimmed = path.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Extract per-field messages from an API error body, restricted to
 * `knownFields` so an unexpected server key can't render an orphan error with
 * nowhere to attach. Anything that doesn't map to a known field is returned
 * separately as `formLevel` for a single fallback message.
 */
export function mapServerErrors<Field extends string>(
  body: ApiErrorBody | null | undefined,
  knownFields: readonly Field[],
): { fieldErrors: FieldErrors<Field>; formLevel: string | null } {
  const known = new Set<string>(knownFields);
  const fieldErrors: FieldErrors<Field> = {};
  const unmatched: string[] = [];

  const assign = (rawField: string | null, message: string | undefined) => {
    if (!message) return;
    if (rawField && known.has(rawField)) {
      if (!fieldErrors[rawField as Field]) {
        fieldErrors[rawField as Field] = message;
      }
    } else {
      unmatched.push(message);
    }
  };

  if (body?.fieldErrors) {
    for (const [field, value] of Object.entries(body.fieldErrors)) {
      assign(field, Array.isArray(value) ? value[0] : value);
    }
  }

  for (const entry of body?.errors ?? []) {
    assign(normalisePath(entry.path), entry.message);
  }

  const formLevel =
    unmatched[0] ??
    (Object.keys(fieldErrors).length === 0 ? (body?.message ?? null) : null);

  return { fieldErrors, formLevel };
}
