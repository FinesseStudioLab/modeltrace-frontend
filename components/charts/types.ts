/** Shared shapes for the chart set. Deliberately plain — these cross a Server
 *  Component boundary, so nothing here may carry a function or a class. */

export interface Series {
  label: string;
  values: number[];
}

/**
 * Every chart takes the same four fields, so empty, loading, and error states
 * are handled identically everywhere instead of being reinvented per surface.
 */
export interface ChartBaseProps {
  title: string;
  /** Sentence describing what the chart shows and its headline finding. Read
   *  by screen readers in place of the graphic, so it must carry the finding —
   *  "usage by model over 12 weeks" is a caption, not an alternative. */
  summary: string;
  state?: "ready" | "loading" | "error" | "empty";
  /** Shown instead of the chart when state is "error". */
  errorMessage?: string;
  /** Units appended to values in the table and labels, e.g. "req" or "USDC". */
  unit?: string;
}

export type ChartState = NonNullable<ChartBaseProps["state"]>;
