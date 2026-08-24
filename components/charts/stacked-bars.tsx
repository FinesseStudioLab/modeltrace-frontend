import { ChartFrame, chartStyles as styles } from "./chart-frame";
import { DataTable } from "./data-table";
import { foldToCap, seriesHatchAngle, slotColor } from "./palette";
import type { ChartBaseProps, Series } from "./types";

interface StackedBarsProps extends ChartBaseProps {
  labels: string[];
  series: Series[];
  height?: number;
}

const W = 720;
const PAD = { top: 16, right: 16, bottom: 30, left: 52 };
const GAP = 2; // surface gap between stacked segments, per the mark spec

/**
 * Composition over a categorical axis — usage by model, per period.
 *
 * Segments are separated by a 2px gap in the surface colour rather than a
 * stroke, so adjacent segments stay countable without adding a second visual
 * language to the chart. Each segment also carries a hatch at its own angle:
 * in greyscale, in forced-colours mode, or for a reader who cannot separate
 * the hues, the stack is still readable.
 */
export function StackedBars({
  labels,
  series,
  height = 260,
  unit,
  ...base
}: StackedBarsProps) {
  const folded = foldToCap(series);
  const isEmpty = labels.length === 0 || folded.length === 0;
  const state = base.state ?? (isEmpty ? "empty" : "ready");

  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const totals = labels.map((_, i) => folded.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  const max = Math.max(1, ...totals);
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const axisMax = Math.ceil(max / step) * step;

  const slot = innerW / Math.max(1, labels.length);
  const barW = Math.min(46, slot * 0.62);
  const cx = (i: number) => PAD.left + slot * i + slot / 2;
  const yOf = (v: number) => (v / axisMax) * innerH;
  const ticks = [0, 0.5, 1].map((t) => Math.round(axisMax * t));
  const labelEvery = Math.ceil(labels.length / 10);

  return (
    <ChartFrame
      wide
      {...base}
      state={state}
      unit={unit}
      legend={folded.map((s, i) => ({
        label: s.label,
        color: slotColor(i, s.isOther),
        pattern: `hatch ${seriesHatchAngle(i)}°`,
      }))}
      table={
        <DataTable
          caption={`${base.title} — full values`}
          rowHeader="Model"
          columns={labels}
          rows={folded.map((s, i) => ({
            label: s.label,
            color: slotColor(i, s.isOther),
            values: s.values,
          }))}
          unit={unit}
          showTotals
        />
      }
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          {folded.map((s, si) => (
            <pattern
              key={s.label}
              id={`hatch-${si}`}
              patternUnits="userSpaceOnUse"
              width={6}
              height={6}
              patternTransform={`rotate(${seriesHatchAngle(si)})`}
            >
              <rect width={6} height={6} fill={slotColor(si, s.isOther)} />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={6}
                stroke="var(--chart-surface)"
                strokeWidth={1.1}
                opacity={0.34}
              />
            </pattern>
          ))}
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + innerH - yOf(tick)}
              y2={PAD.top + innerH - yOf(tick)}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={PAD.top + innerH - yOf(tick) + 3}
              textAnchor="end"
              className={styles.axisText}
            >
              {tick}
            </text>
          </g>
        ))}

        {labels.map((label, i) => {
          let cursor = 0;
          return (
            <g key={label}>
              {folded.map((s, si) => {
                const v = s.values[i] ?? 0;
                if (v <= 0) return null;
                const h = Math.max(0, yOf(v) - GAP);
                const yTop = PAD.top + innerH - yOf(cursor) - h;
                cursor += v;
                const isTop = folded
                  .slice(si + 1)
                  .every((rest) => (rest.values[i] ?? 0) <= 0);
                return (
                  <rect
                    key={s.label}
                    className={styles.mark}
                    x={cx(i) - barW / 2}
                    y={yTop}
                    width={barW}
                    height={h}
                    fill={`url(#hatch-${si})`}
                    // Only the top segment gets rounded ends; the rest stay
                    // square so the stack reads as one bar.
                    rx={isTop ? 4 : 0}
                  >
                    <title>{`${s.label} · ${label}: ${v}${unit ? ` ${unit}` : ""}`}</title>
                  </rect>
                );
              })}
            </g>
          );
        })}

        {labels.map((label, i) =>
          i % labelEvery === 0 ? (
            <text key={label} x={cx(i)} y={H - 10} textAnchor="middle" className={styles.axisText}>
              {label}
            </text>
          ) : null,
        )}

        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + innerH}
          y2={PAD.top + innerH}
          stroke="var(--chart-axis)"
          strokeWidth={1}
        />
      </svg>
    </ChartFrame>
  );
}
