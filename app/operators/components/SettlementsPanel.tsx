import { fetchSettlements } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";

export default async function SettlementsPanel() {
  const data = await fetchSettlements();

  if (data.escrowed === 0 && data.disputed === 0 && data.released === 0) {
    return <PanelEmpty message="No settlement activity to display." />;
  }

  const formatTokens = (val: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(val);

  return (
    <div className="card">
      <h3 style={{ margin: "0 0 8px" }}>Settlement Status</h3>
      <p style={{ color: "var(--muted)", margin: "0 0 16px", fontSize: "0.9rem" }}>Overview of token flows across escrow contracts.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, textAlign: "center", borderTop: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)", paddingTop: 16 }}>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Escrowed</p>
          <strong style={{ fontSize: "1.5rem" }}>{formatTokens(data.escrowed)}</strong>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Disputed</p>
          <strong style={{ fontSize: "1.5rem", color: "color-mix(in srgb, orange 90%, white)" }}>{formatTokens(data.disputed)}</strong>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Released</p>
          <strong style={{ fontSize: "1.5rem", color: "color-mix(in srgb, var(--accent-2) 90%, white)" }}>{formatTokens(data.released)}</strong>
        </div>
      </div>
    </div>
  );
}
