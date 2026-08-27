import { fetchUsage } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";
import { UsageChartInteractive } from "./UsageChartInteractive";

export default async function UsagePanel() {
  const data = await fetchUsage();

  if (!data.labels || data.labels.length === 0) {
    return <PanelEmpty message="No usage data recorded yet." />;
  }

  return <UsageChartInteractive data={data} />;
}
