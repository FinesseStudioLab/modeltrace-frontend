"use client";

import React from "react";

export function PanelLoading() {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px" }}>
      <p style={{ color: "var(--muted)", margin: 0 }}>Loading data...</p>
    </div>
  );
}

export function PanelEmpty({ message = "No data available yet." }: { message?: string }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px", flexDirection: "column", gap: "8px" }}>
      <p style={{ color: "var(--muted)", margin: 0 }}>{message}</p>
      <span className="tag" style={{ margin: 0, fontSize: "0.7rem" }}>Awaiting activity</span>
    </div>
  );
}

export function PanelError({ reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px", flexDirection: "column", gap: "12px", border: "1px solid color-mix(in srgb, red 30%, transparent)" }}>
      <p style={{ color: "color-mix(in srgb, red 80%, white)", margin: 0, fontSize: "0.9rem" }}>Failed to load data</p>
      {reset && (
        <button onClick={reset} className="cta-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", background: "transparent" }}>
          Retry
        </button>
      )}
    </div>
  );
}
