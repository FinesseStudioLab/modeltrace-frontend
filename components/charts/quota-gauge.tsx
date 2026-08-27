import { ChartFrame, chartStyles as styles } from "./chart-frame";
import { DataTable } from "./data-table";
import { STATUS_COLORS, type StatusTone } from "./palette";
import type { ChartBaseProps } from "./types";
import { getMessages } from "@/lib/i18n";
import { formatNumber, interpolate } from "@/lib/i18n/formatters";

interface QuotaGaugeProps extends ChartBaseProps {
  used: number;
  limit: number;
  /** Fraction of the limit at which the gauge turns warning / critical. */
  thresholds?: { warning: number; critical: number };
}

const W = 320;
const H = 176;
const R = 108;
const CX = W / 2;
const CY = 140;
const TRACK = 16;

/** Point on the 180° arc, 0 = left end, 1 = right end. */
function point(t: number) {
  const angle = Math.PI * (1 - t);
  return { x: CX + R * Math.cos(angle), y: CY - R * Math.sin(angle) };
}

function arc(from: number, to: number) {
  const a = point(from);
  const b = point(to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 ${to - from > 0.5 ? 1 : 0} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

/**
 * A single headline number with its limit — the one place a gauge beats a bar,
 * because the reader's question is "how close am I to the ceiling", not "how
 * does this compare to last week".
 *
 * The status colour is reserved: good / warning / critical never double as
 * series colours, and the state always ships with its label in text. A reader
 * who cannot see the colour still reads "Approaching limit".
 */
export function QuotaGauge({
  used,
  limit,
  thresholds = { warning: 0.8, critical: 0.95 },
  unit,
  ...base
}: QuotaGaugeProps) {
  const m = getMessages();
  const qg = m.quotaGauge;

  const toneLabel: Record<StatusTone, string> = {
    good: qg.toneGood,
    warning: qg.toneWarning,
    critical: qg.toneCritical,
  };

  const safeLimit = limit > 0 ? limit : 1;
  const ratio = Math.min(1, Math.max(0, used / safeLimit));
  const tone: StatusTone =
    ratio >= thresholds.critical ? "critical" : ratio >= thresholds.warning ? "warning" : "good";
  const color = STATUS_COLORS[tone];
  const percent = Math.round(ratio * 100);
  const state = base.state ?? (limit <= 0 ? "empty" : "ready");

  // Locale-aware number formatting — no hardcoded "en-US".
  const usedFormatted = formatNumber(used);
  const limitFormatted = formatNumber(limit);

  const svgTitle = interpolate(qg.svgTitle, {
    used: usedFormatted,
    limit: limitFormatted,
    unit: unit ? ` ${unit}` : "",
    percent: `${percent}%`,
  });

  return (
    <ChartFrame
      {...base}
      state={state}
      unit={unit}
      table={
        <DataTable
          caption={`${base.title} ${qg.fullValuesSuffix}`}
          rowHeader={qg.measureUsed /* "Measure" column header */}
          columns={["Value"]}
          rows={[
            { label: qg.measureUsed, color, values: [used] },
            { label: qg.measureLimit, values: [limit] },
            { label: qg.measureRemaining, values: [Math.max(0, limit - used)] },
          ]}
          unit={unit}
        />
      }
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path
          d={arc(0, 1)}
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth={TRACK}
          strokeLinecap="round"
        />
        {ratio > 0 ? (
          <path
            className={styles.mark}
            d={arc(0, ratio)}
            fill="none"
            stroke={color}
            strokeWidth={TRACK}
            strokeLinecap="round"
          >
            <title>{svgTitle}</title>
          </path>
        ) : null}

        {/* The threshold marks are why the gauge is worth its space: they show
            where the number stops being fine, not just where it is. */}
        {[thresholds.warning, thresholds.critical].map((t) => {
          const inner = { x: CX + (R - TRACK) * Math.cos(Math.PI * (1 - t)), y: CY - (R - TRACK) * Math.sin(Math.PI * (1 - t)) };
          const outer = { x: CX + (R + TRACK / 2) * Math.cos(Math.PI * (1 - t)), y: CY - (R + TRACK / 2) * Math.sin(Math.PI * (1 - t)) };
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--chart-axis)"
              strokeWidth={1.5}
            />
          );
        })}

        <text x={CX} y={CY - 24} textAnchor="middle" className={styles.gaugeValue}>
          {percent}%
        </text>
        <text x={CX} y={CY - 4} textAnchor="middle" className={styles.gaugeCaption}>
          {toneLabel[tone]}
        </text>
        <text x={CX} y={CY + 16} textAnchor="middle" className={styles.gaugeCaption}>
          {usedFormatted} / {limitFormatted}
          {unit ? ` ${unit}` : ""}
        </text>
      </svg>
    </ChartFrame>
  );
}
