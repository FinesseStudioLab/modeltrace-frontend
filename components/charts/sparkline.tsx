import styles from "./charts.module.css";
import { STATUS_COLORS } from "./palette";

interface SparklineProps {
  values: number[];
  /** Read out in place of the graphic — a sparkline with no alternative is a
   *  decoration, and a tile is exactly where that goes unnoticed. */
  label: string;
  width?: number;
  height?: number;
  /** Colours the trend when direction carries meaning. Omit for neutral. */
  tone?: "neutral" | "good" | "critical";
}

/**
 * Trend inside a stat tile.
 *
 * No axes, no grid, no labels — a sparkline earns its place by being small
 * enough to sit beside a number, and every piece of chrome added to it takes
 * that away. The number it accompanies carries the value; this carries only
 * the shape.
 */
export function Sparkline({
  values,
  label,
  width = 96,
  height = 28,
  tone = "neutral",
}: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 3;

  const x = (i: number) => (i / (values.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const d = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const color =
    tone === "neutral" ? "var(--accent, #59c2ff)" : STATUS_COLORS[tone === "good" ? "good" : "critical"];
  const last = values[values.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${label}. ${values.length} points, from ${values[0]} to ${last}.`}
    >
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* The final point is the one a reader looks for; it gets the surface
          ring so it stays visible against the line's own overlap. */}
      <circle
        className={styles.mark}
        cx={x(values.length - 1)}
        cy={y(last)}
        r={2.75}
        fill={color}
        stroke="var(--chart-surface, #0f1727)"
        strokeWidth={1.5}
      />
    </svg>
  );
}

