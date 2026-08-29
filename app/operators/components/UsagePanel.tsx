import { fetchUsage } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";
import { UsageChartInteractive } from "./UsageChartInteractive";
import { getMessages } from "@/lib/i18n";

export default async function UsagePanel() {
  const data = await fetchUsage();
  const m = getMessages();

  if (!data.labels || data.labels.length === 0) {
    return <PanelEmpty message={m.usageChart.emptyMessage} />;
  }

  return <UsageChartInteractive data={data} />;
}
