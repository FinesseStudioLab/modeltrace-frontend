import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PanelLoading } from "./components/PanelStates";
import UsagePanel from "./components/UsagePanel";
import QuotasPanel from "./components/QuotasPanel";
import AttestationsPanel from "./components/AttestationsPanel";
import SettlementsPanel from "./components/SettlementsPanel";

export const metadata: Metadata = {
  title: "Operators",
  description: "Operator dashboard — live testnet data and quota headroom.",
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Operators</span>
      <h1>Operator dashboard</h1>
      <p style={{ color: "var(--muted)", maxWidth: "62ch", marginBottom: 24 }}>
        Attestation volume, usage by model, and quota headroom. Data is sourced directly from the testnet settlement layer.
      </p>

      {/* Top summary row: Settlements and Quotas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 24 }}>
        <ErrorBoundary>
          <Suspense fallback={<PanelLoading />}>
            <SettlementsPanel />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<PanelLoading />}>
            <QuotasPanel />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Main interactive chart */}
      <div style={{ marginBottom: 24 }}>
        <ErrorBoundary>
          <Suspense fallback={<PanelLoading />}>
            <UsagePanel />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Recent attestations table */}
      <div>
        <ErrorBoundary>
          <Suspense fallback={<PanelLoading />}>
            <AttestationsPanel />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
