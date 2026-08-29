import { fetchQuotas } from "../../../lib/api/operators";
import { QuotaGauge } from "../../../components/charts";
import { PanelEmpty } from "./PanelStates";

function generateSummary(used: number, limit: number, unit: string) {
  const percent = (used / limit) * 100;
  let text = `${used} of ${limit} ${unit} used — ${Math.round(percent)}%`;
  if (percent >= 80) {
    text += ", past the 80% warning threshold.";
  }
  return text;
}

export default async function QuotasPanel() {
  const data = await fetchQuotas();

  if (!data || Object.keys(data).length === 0) {
    return <PanelEmpty message="No quota data available." />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      <QuotaGauge
        title="Attestation quota"
        summary={generateSummary(data.attestation.used, data.attestation.limit, data.attestation.unit)}
        used={data.attestation.used}
        limit={data.attestation.limit}
        unit={data.attestation.unit}
      />
      <QuotaGauge
        title="Export quota"
        summary={generateSummary(data.export.used, data.export.limit, data.export.unit)}
        used={data.export.used}
        limit={data.export.limit}
        unit={data.export.unit}
      />
    </div>
  );
}
