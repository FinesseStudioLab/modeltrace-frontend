import { fetchRecentAttestations } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";
import { getMessages } from "@/lib/i18n";
import { formatTime, formatNumber } from "@/lib/i18n/formatters";

export default async function AttestationsPanel() {
  const { attestations } = await fetchRecentAttestations();
  const m = getMessages();
  const ap = m.attestationsPanel;

  if (!attestations || attestations.length === 0) {
    return <PanelEmpty message={ap.emptyMessage} />;
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 18px 0" }}>
        <h3 style={{ margin: "0 0 8px" }}>{ap.title}</h3>
        <p style={{ color: "var(--muted)", margin: "0 0 16px", fontSize: "0.9rem" }}>{ap.subtitle}</p>
      </div>
      <div className="site-map" style={{ paddingTop: 0, borderTop: "none" }}>
        <table>
          <thead>
            <tr>
              <th>{ap.colTime}</th>
              <th>{ap.colModel}</th>
              <th>{ap.colPayer}</th>
              <th>{ap.colTokens}</th>
              <th>{ap.colTransaction}</th>
            </tr>
          </thead>
          <tbody>
            {attestations.map((att) => (
              <tr key={att.id}>
                {/* formatTime uses the active locale — no bare toLocaleTimeString() */}
                <td>{formatTime(att.timestamp)}</td>
                <td>{att.model}</td>
                <td>{att.payer}</td>
                {/* formatNumber uses the active locale — no bare toLocaleString() */}
                <td>{formatNumber(att.tokens)}</td>
                <td>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${att.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--accent)", textDecoration: "underline" }}
                  >
                    {att.txHash.substring(0, 8)}...
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
