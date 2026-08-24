import type { Metadata } from "next";
import {
  QuotaGauge,
  Sparkline,
  StackedBars,
  TimeSeries,
} from "../../components/charts";

export const metadata: Metadata = {
  title: "Operators",
  description:
    "Operator dashboard — attestation volume, usage by model, and quota headroom.",
};

/**
 * Sample data stands in for the metering API until it lands. It is shaped the
 * way the loaders will return it so wiring them up is a swap, not a rewrite.
 */
const WEEKS = ["W31", "W32", "W33", "W34", "W35", "W36", "W37", "W38"];

const attestations = [
  { label: "Accepted", values: [412, 468, 501, 495, 560, 604, 651, 690] },
  { label: "Disputed", values: [18, 22, 15, 31, 24, 19, 27, 21] },
];

const usageByModel = [
  { label: "gpt-oss-120b", values: [180, 205, 220, 214, 246, 268, 289, 310] },
  { label: "llama-3.1-70b", values: [120, 131, 140, 148, 156, 168, 177, 188] },
  { label: "mistral-large", values: [78, 84, 92, 88, 101, 109, 115, 121] },
  { label: "claude-sonnet", values: [52, 60, 64, 66, 71, 78, 84, 92] },
  { label: "phi-4", values: [12, 14, 16, 15, 18, 20, 22, 24] },
];

const tiles = [
  { label: "Attestations this week", value: "690", trend: [412, 468, 501, 495, 560, 604, 651, 690], tone: "good" as const },
  { label: "Open disputes", value: "21", trend: [18, 22, 15, 31, 24, 19, 27, 21], tone: "neutral" as const },
  { label: "Settlement latency (p95)", value: "6.4s", trend: [9.1, 8.7, 8.2, 7.6, 7.4, 6.9, 6.6, 6.4], tone: "good" as const },
];

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Operators</span>
      <h2>Operator dashboard</h2>
      <p style={{ color: "var(--muted)", maxWidth: "62ch" }}>
        Attestation volume, usage by model, and quota headroom. Every chart on
        this page ships its numbers as a table — an auditor asking for the
        underlying figures should not have to ask anyone.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          padding: "18px 0 8px",
        }}
      >
        {tiles.map((tile) => (
          <div className="card" key={tile.label}>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "0 0 6px" }}>
              {tile.label}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <strong style={{ fontSize: "1.7rem", letterSpacing: "-0.02em" }}>{tile.value}</strong>
              <Sparkline
                values={tile.trend}
                label={`${tile.label} trend over 8 weeks`}
                tone={tile.tone}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16, padding: "8px 0 40px" }}>
        <TimeSeries
          title="Attestation volume"
          summary="Accepted attestations rose from 412 to 690 per week over eight weeks, while disputes stayed flat between 15 and 31."
          labels={WEEKS}
          series={attestations}
          unit="events"
        />

        <StackedBars
          title="Usage by model"
          summary="Weekly inference volume by model. gpt-oss-120b accounts for roughly half of all usage; the two smallest models are folded into Other."
          labels={WEEKS}
          series={usageByModel}
          unit="k tokens"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <QuotaGauge
            title="Attestation quota"
            summary="690 of 800 weekly attestations used — 86%, past the 80% warning threshold."
            used={690}
            limit={800}
            unit="events"
          />
          <QuotaGauge
            title="Export quota"
            summary="Compliance export quota for the current billing period."
            used={12}
            limit={50}
            unit="exports"
          />
        </div>
      </div>
    </section>
  );
}
