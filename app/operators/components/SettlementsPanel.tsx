import { fetchSettlements } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";
import { getMessages } from "@/lib/i18n";
import { formatCompact } from "@/lib/i18n/formatters";

export default async function SettlementsPanel() {
  const data = await fetchSettlements();
  const m = getMessages();
  const sp = m.settlementsPanel;

  if (data.escrowed === 0 && data.disputed === 0 && data.released === 0) {
    return <PanelEmpty message={sp.emptyMessage} />;
  }

  // formatCompact reads the active locale — no hardcoded "en-US".
  const fmt = (val: number) => formatCompact(val);

  return (
    <div className="card">
      <h3 style={{ margin: "0 0 8px" }}>{sp.title}</h3>
      <p style={{ color: "var(--muted)", margin: "0 0 16px", fontSize: "0.9rem" }}>{sp.subtitle}</p>

      {/*
        repeat(3, minmax(0, 1fr)) instead of repeat(3, 1fr):
        - minmax(0, 1fr) allows columns to shrink below their content width,
          so a translated label that is 30–40% longer than English does not
          overflow its cell or push the card wider than the viewport.
        - flex-wrap is not used here because the three stat tiles should stay
          side-by-side on most screens; the min-width on the card grid above
          already controls when the whole panel reflows.
      */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, textAlign: "center", borderTop: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)", paddingTop: 16 }}>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sp.escrowed}</p>
          <strong style={{ fontSize: "1.5rem" }}>{fmt(data.escrowed)}</strong>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sp.disputed}</p>
          <strong style={{ fontSize: "1.5rem", color: "color-mix(in srgb, orange 90%, white)" }}>{fmt(data.disputed)}</strong>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sp.released}</p>
          <strong style={{ fontSize: "1.5rem", color: "color-mix(in srgb, var(--accent-2) 90%, white)" }}>{fmt(data.released)}</strong>
        </div>
      </div>
    </div>
  );
}
