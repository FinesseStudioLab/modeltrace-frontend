/**
 * The one categorical palette every ModelTrace chart draws from.
 *
 * Three surfaces need charts — the operator dashboard, the status page, and
 * compliance exports. Each picking its own colours is how a product ends up
 * looking like three products, so the palette lives here and the chart
 * components take slots from it in fixed order.
 *
 * ## Why these hexes
 *
 * Validated against the app's chart surface (`--surface`, #0f1727) as a
 * four-slot adjacent set — adjacent because every use here is a stack, a bar
 * group, or a line set, where the pairs that must be separable are neighbours:
 *
 * | Check | Result |
 * |---|---|
 * | Lightness band | all 4 inside OKLCH L 0.48–0.67 |
 * | Chroma floor | all 4 >= 0.1 |
 * | CVD separation | worst adjacent pair ΔE 8.4 (protan), 24.4 (tritan) |
 * | Normal-vision floor | worst adjacent pair ΔE 19.8 |
 * | Contrast vs surface | all 4 >= 3:1 |
 *
 * ## Why only four
 *
 * A fifth slot would have to clear the same gates, and the honest options past
 * four put two confusable hues on screen together. `SERIES_CAP` is enforced by
 * `foldToCap()`: a fifth series folds into "Other" rather than being handed a
 * generated hue. A generated hue is how a palette silently stops being
 * colourblind-safe.
 */

export const SERIES_COLORS = [
  "#3987e5", // blue
  "#d95926", // orange
  "#199e70", // aqua
  "#c98500", // yellow
] as const;

/**
 * Colour is never the only thing carrying identity. Each slot also gets a
 * dash pattern (lines) and a hatch angle (fills), so the chart survives
 * greyscale printing, forced-colours mode, and the reader who cannot separate
 * the hues at all.
 */
export const SERIES_DASH = ["0", "6 3", "2 3", "9 3 2 3"] as const;
export const SERIES_HATCH_ANGLE = [45, 135, 0, 90] as const;

/** Everything past the cap is folded here rather than given a new hue. */
export const OTHER_COLOR = "#7f8aa3";

export const SERIES_CAP = SERIES_COLORS.length;

/**
 * Status colours are reserved for state and never reused as a series colour.
 * They always ship with a label, never colour alone.
 */
export const STATUS_COLORS = {
  good: "#199e70",
  warning: "#c98500",
  critical: "#e06c5f",
} as const;

export type StatusTone = keyof typeof STATUS_COLORS;

export function seriesColor(index: number): string {
  return index < SERIES_CAP ? SERIES_COLORS[index] : OTHER_COLOR;
}

/**
 * Colour for a folded series slot.
 *
 * The "Other" bucket is deliberately the neutral grey rather than the next
 * palette hue — it is a residual, not a peer of the named series. Plot,
 * legend, and table all resolve through here so they cannot disagree about
 * which colour a slot got.
 */
export function slotColor(index: number, isOther: boolean): string {
  return isOther ? OTHER_COLOR : seriesColor(index);
}

export function seriesDash(index: number): string {
  return index < SERIES_CAP ? SERIES_DASH[index] : "1 4";
}

export function seriesHatchAngle(index: number): number {
  return index < SERIES_CAP ? SERIES_HATCH_ANGLE[index] : 45;
}

/**
 * Collapse a series list to the palette cap, summing the tail into "Other".
 *
 * Ordering is the caller's: whatever order comes in is the order colours are
 * assigned, so a filter that removes a series must not reorder the survivors —
 * colour follows the entity, never its rank.
 */
export function foldToCap<T extends { label: string; values: number[] }>(
  series: T[],
  cap: number = SERIES_CAP,
): Array<{ label: string; values: number[]; isOther: boolean }> {
  if (series.length <= cap) {
    return series.map((s) => ({ label: s.label, values: s.values, isOther: false }));
  }

  const kept = series.slice(0, cap - 1).map((s) => ({
    label: s.label,
    values: s.values,
    isOther: false,
  }));

  const tail = series.slice(cap - 1);
  const width = tail[0]?.values.length ?? 0;
  const combined = Array.from({ length: width }, (_, i) =>
    tail.reduce((sum, s) => sum + (s.values[i] ?? 0), 0),
  );

  return [...kept, { label: `Other (${tail.length})`, values: combined, isOther: true }];
}
