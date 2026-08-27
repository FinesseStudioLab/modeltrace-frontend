"use client";

import { useState } from "react";
import { StackedBars } from "../../../components/charts";
import type { UsageResponse } from "../../../lib/api/operators";
import { useMessages } from "@/lib/i18n";

export function UsageChartInteractive({ data }: { data: UsageResponse }) {
  const [view, setView] = useState<"model" | "payer">("model");
  const m = useMessages();
  const uc = m.usageChart;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={() => setView("model")}
          className={view === "model" ? "tag" : ""}
          style={{
            cursor: "pointer",
            background: view === "model" ? undefined : "transparent",
            border: view === "model" ? undefined : "1px solid var(--muted)",
            color: view === "model" ? undefined : "var(--muted)",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.78rem"
          }}
        >
          {uc.byModel}
        </button>
        <button
          onClick={() => setView("payer")}
          className={view === "payer" ? "tag" : ""}
          style={{
            cursor: "pointer",
            background: view === "payer" ? undefined : "transparent",
            border: view === "payer" ? undefined : "1px solid var(--muted)",
            color: view === "payer" ? undefined : "var(--muted)",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.78rem"
          }}
        >
          {uc.byPayer}
        </button>
      </div>

      <StackedBars
        title={view === "model" ? uc.titleByModel : uc.titleByPayer}
        summary={view === "model" ? uc.summaryByModel : uc.summaryByPayer}
        labels={data.labels}
        series={view === "model" ? data.usageByModel : data.usageByPayer}
        unit="k tokens"
      />
    </div>
  );
}
