"use client";

import React from "react";
import { useMessages } from "@/lib/i18n";

export function PanelLoading() {
  const m = useMessages();
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px" }}>
      <p style={{ color: "var(--muted)", margin: 0 }}>{m.panelStates.loading}</p>
    </div>
  );
}

export function PanelEmpty({ message }: { message?: string }) {
  const m = useMessages();
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px", flexDirection: "column", gap: "8px" }}>
      <p style={{ color: "var(--muted)", margin: 0 }}>{message ?? m.panelStates.empty}</p>
      <span className="tag" style={{ margin: 0, fontSize: "0.7rem" }}>{m.panelStates.awaitingActivity}</span>
    </div>
  );
}

export function PanelError({ reset }: { error?: Error; reset?: () => void }) {
  const m = useMessages();
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px", flexDirection: "column", gap: "12px", border: "1px solid color-mix(in srgb, red 30%, transparent)" }}>
      <p style={{ color: "color-mix(in srgb, red 80%, white)", margin: 0, fontSize: "0.9rem" }}>{m.panelStates.error}</p>
      {reset && (
        <button onClick={reset} className="cta-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", background: "transparent" }}>
          {m.panelStates.retry}
        </button>
      )}
    </div>
  );
}
