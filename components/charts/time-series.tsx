import { ChartFrame, chartStyles as styles } from "./chart-frame";
import { DataTable } from "./data-table";
import { foldToCap, seriesDash, slotColor } from "./palette";
import type { ChartBaseProps, Series } from "./types";

interface TimeSeriesProps extends ChartBaseProps {
  /** X-axis category labels — one per value in each series. */
  labels: string[];
  series: Series[];
  height?: number;
}

const W = 720;
const PAD = { top: 16, right: 92, bottom: 28, left: 46 };

const DASH_NAME: Record<string, string> = {
  "0": "solid",
  "6 3": "dashed",
  "2 3": "dotted",
  "9 3 2 3": "dash-dot",
};

/**
 * Change over time, as lines.
 *
 * One y-axis, always. Two measures of different scale get two charts — a
 * second y-scale lets the author put any two lines in any relationship they
 * like, which is why a dual axis is the single most misleading chart form.
 *
 * Series are direct-labelled at the line end when there are four or fewer, so
 * identity does not depend on tracking a legend swatch back to a line. The
 * dash pattern repeats the identity for anyone who cannot use the colour.
 */
export function TimeSeries({
  labels,
  series,
  height = 240,
  unit,
  ...base
}: TimeSeriesProps) {
  const folded = foldToCap(series);
  const isEmpty = labels.length === 0 || folded.length === 0;
  const state = base.state ?? (isEmpty ? "empty" : "ready");

  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const max = Math.max(1, ...folded.flatMap((s) => s.values));
  // Round the axis top to something a reader can do arithmetic against.
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const axisMax = Math.ceil(max / step) * step;

  const x = (i: number) =>
    PAD.left + (labels.length <= 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / axisMax) * innerH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(axisMax * t));
  // Thin out x labels so they never collide, whatever the series length.
  const labelEvery = Math.ceil(labels.length / 8);

  return (
    <ChartFrame
      wide
      {...base}
      state={state}
      unit={unit}
      legend={folded.map((s, i) => ({
        label: s.label,
        color: slotColor(i, s.isOther),
        pattern: DASH_NAME[seriesDash(i)],
      }))}
      table={
        <DataTable
          caption={`${base.title} — full values`}
          rowHeader="Series"
          columns={labels}
          rows={folded.map((s, i) => ({
            label: s.label,
            color: slotColor(i, s.isOther),
            values: s.values,
          }))}
          unit={unit}
        />
      }
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text x={PAD.left - 8} y={y(tick) + 3} textAnchor="end" className={styles.axisText}>
              {tick}
            </text>
          </g>
        ))}

        {labels.map((label, i) =>
          i % labelEvery === 0 ? (
            <text key={label + i} x={x(i)} y={H - 8} textAnchor="middle" className={styles.axisText}>
              {label}
            </text>
          ) : null,
        )}

        {folded.map((s, si) => {
          const color = slotColor(si, s.isOther);
          const d = s.values
            .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`)
            .join(" ");
          const lastIndex = s.values.length - 1;

          return (
            <g key={s.label}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeDasharray={seriesDash(si)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => (
                // 8px hit target, and a surface ring so overlapping markers
                // from different series stay countable.
                <circle
                  key={i}
                  className={styles.mark}
                  cx={x(i)}
                  cy={y(v)}
                  r={4}
                  fill={color}
                  stroke="var(--chart-surface)"
                  strokeWidth={2}
                >
                  <title>{`${s.label} · ${labels[i]}: ${v}${unit ? ` ${unit}` : ""}`}</title>
                </circle>
              ))}
              {folded.length <= 4 && lastIndex >= 0 ? (
                <text
                  x={x(lastIndex) + 10}
                  y={y(s.values[lastIndex]) + 4}
                  className={styles.directLabel}
                >
                  {s.label}
                </text>
              ) : null}
            </g>
          );
        })}

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
