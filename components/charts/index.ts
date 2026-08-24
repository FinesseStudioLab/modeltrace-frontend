/**
 * ModelTrace chart primitives.
 *
 * Hand-rolled SVG rendered in Server Components. See the approach note in the
 * PR that introduced this directory: for the four forms the dashboard and
 * status page need, this ships 0 KB of client JavaScript against roughly
 * 50-100 KB gzipped for a charting library, and the charts are static enough
 * that the interactivity a library buys is served by native SVG tooltips and
 * the data table instead.
 */
export { ChartFrame, chartStyles, type LegendEntry } from "./chart-frame";
export { DataTable } from "./data-table";
export { QuotaGauge } from "./quota-gauge";
export { Sparkline } from "./sparkline";
export { StackedBars } from "./stacked-bars";
export { TimeSeries } from "./time-series";
export {
  foldToCap,
  OTHER_COLOR,
  SERIES_CAP,
  SERIES_COLORS,
  SERIES_DASH,
  SERIES_HATCH_ANGLE,
  seriesColor,
  seriesDash,
  seriesHatchAngle,
  slotColor,
  STATUS_COLORS,
  type StatusTone,
} from "./palette";
export type { ChartBaseProps, ChartState, Series } from "./types";
