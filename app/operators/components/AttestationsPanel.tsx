import { fetchRecentAttestations } from "../../../lib/api/operators";
import { PanelEmpty } from "./PanelStates";

export default async function AttestationsPanel() {
  const { attestations } = await fetchRecentAttestations();

  if (!attestations || attestations.length === 0) {
    return <PanelEmpty message="No recent attestations." />;
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 18px 0" }}>
        <h3 style={{ margin: "0 0 8px" }}>Recent Attestations</h3>
        <p style={{ color: "var(--muted)", margin: "0 0 16px", fontSize: "0.9rem" }}>The latest validated inferences stored on-chain.</p>
      </div>
      <div className="site-map" style={{ paddingTop: 0, borderTop: "none" }}>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Model</th>
              <th>Payer</th>
              <th>Tokens</th>
              <th>Transaction</th>
            </tr>
          </thead>
          <tbody>
            {attestations.map((att) => (
              <tr key={att.id}>
                <td>{new Date(att.timestamp).toLocaleTimeString()}</td>
                <td>{att.model}</td>
                <td>{att.payer}</td>
                <td>{att.tokens.toLocaleString()}</td>
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
