import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PanelLoading } from "./components/PanelStates";
import UsagePanel from "./components/UsagePanel";
import QuotasPanel from "./components/QuotasPanel";
import AttestationsPanel from "./components/AttestationsPanel";
import SettlementsPanel from "./components/SettlementsPanel";
import { getMessages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Operators",
  description: "Operator dashboard — live testnet data and quota headroom.",
};

export default function Page() {
  const m = getMessages();
  const op = m.operatorsPage;

  return (
    <section className="section">
      <span className="tag">{op.tag}</span>
      <h2>{op.heading}</h2>
      <p style={{ color: "var(--muted)", maxWidth: "62ch", marginBottom: 24 }}>
        {op.lead}
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
