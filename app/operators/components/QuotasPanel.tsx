import { fetchQuotas } from "../../../lib/api/operators";
import { QuotaGauge } from "../../../components/charts";
import { PanelEmpty } from "./PanelStates";
import { getMessages } from "@/lib/i18n";
import { formatNumber, interpolate } from "@/lib/i18n/formatters";

function generateSummary(
  used: number,
  limit: number,
  unit: string,
  summaryNormal: string,
  summaryWarning: string,
): string {
  const percent = Math.round((used / limit) * 100);
  const usedFmt = formatNumber(used);
  const limitFmt = formatNumber(limit);
  const template = percent >= 80 ? summaryWarning : summaryNormal;
  return interpolate(template, { used: usedFmt, limit: limitFmt, unit, percent });
}

export default async function QuotasPanel() {
  const data = await fetchQuotas();
  const m = getMessages();
  const qp = m.quotasPanel;

  if (!data || Object.keys(data).length === 0) {
    return <PanelEmpty message={qp.emptyMessage} />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      <QuotaGauge
        title={qp.attestationTitle}
        summary={generateSummary(
          data.attestation.used,
          data.attestation.limit,
          data.attestation.unit,
          qp.summaryNormal,
          qp.summaryWarning,
        )}
        used={data.attestation.used}
        limit={data.attestation.limit}
        unit={data.attestation.unit}
      />
      <QuotaGauge
        title={qp.exportTitle}
        summary={generateSummary(
          data.export.used,
          data.export.limit,
          data.export.unit,
          qp.summaryNormal,
          qp.summaryWarning,
        )}
        used={data.export.used}
        limit={data.export.limit}
        unit={data.export.unit}
      />
    </div>
  );
}
