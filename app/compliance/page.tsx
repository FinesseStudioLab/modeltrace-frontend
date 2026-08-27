import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  title: "Compliance",
  description: getRouteDescription("/compliance"),
};

export default function CompliancePage() {
  return (
    <>
      <section className="landing-hero" style={{ paddingBottom: "24px" }}>
        <div className="landing-hero-inner" style={{ maxWidth: "800px" }}>
          <span className="tag">Compliance</span>
          <h1 className="hero-headline">Cryptographic Audit Trails for AI</h1>
          <p className="landing-lead">
            Verifiable lineage, GDPR-compliant data residency, and deterministic evidence for enterprise AI consumption.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "12px" }}>
        <h2 style={{ marginBottom: "24px" }}>The Evidence Model</h2>
        <div className="card" style={{ marginBottom: "32px" }}>
          <p style={{ margin: 0 }}>
            ModelTrace operates on a principle of detached cryptographic attestation. We <strong>do not</strong> store raw inference data, prompt contents, or model outputs on the ledger. 
            Instead, the protocol produces immutable, time-stamped <strong>cryptographic receipts</strong> (SHA-256 hashes) representing the exact payload transmitted by the AI gateway. 
            Every billed token is deterministically linked to a Stellar transaction hash, providing auditors with a tamper-evident paper trail that outlives vendor relationships.
          </p>
        </div>

        <h2 style={{ marginBottom: "16px" }}>Sample Audit Export</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          What a compliance officer actually sees. Download a sample export below to review the schema and artifact format natively used by ModelTrace.
        </p>
        <div className="card" style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h4 style={{ margin: "0 0 4px" }}>modeltrace-audit-sample.csv</h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>Contains timestamp, payer ID, model version, tokens, payload hash, and the txHash.</p>
          </div>
          <a
            href="/modeltrace-audit-sample.csv"
            download
            className="button"
            style={{
              display: "inline-block",
              background: "var(--fg)",
              color: "var(--bg)",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Download CSV
          </a>
        </div>

        <h2 style={{ marginBottom: "16px" }}>Independent Verification</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          How a third party verifies a row without having to trust ModelTrace or the gateway vendor.
        </p>
        <div className="card" style={{ marginBottom: "32px", padding: "24px" }}>
          <ol className="list" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>
              <strong>Acquire the Export:</strong> Download the CSV audit export containing the raw payload metadata and the corresponding <code>stellar_tx_hash</code>.
            </li>
            <li>
              <strong>Recompute the Hash:</strong> Locally hash the raw inference payload from your internal logs using standard SHA-256.
            </li>
            <li>
              <strong>Query the Ledger:</strong> Query the public Stellar/Soroban ledger for the provided <code>stellar_tx_hash</code>.
            </li>
            <li>
              <strong>Compare:</strong> Verify that the on-chain hash perfectly matches your locally computed hash. This mathematically proves the data existed in exactly that state at the recorded timestamp.
            </li>
          </ol>
        </div>

        <div className="grid">
          <div className="card">
            <h3>Data Residency & GDPR</h3>
            <p style={{ marginBottom: "12px", fontSize: "0.95rem" }}>
              Raw inference content (prompts, responses, PII) is <strong>never</strong> transmitted to or stored on the blockchain. ModelTrace only anchors one-way, irreversible cryptographic hashes.
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              Because the on-chain data consists strictly of anonymized identifiers and hashes, it falls outside the scope of GDPR&apos;s &quot;Right to be Forgotten.&quot; Your sensitive PII remains entirely within your secure gateway perimeter.
            </p>
          </div>

          <div className="card">
            <h3>Retention Guarantees</h3>
            <p style={{ marginBottom: "12px", fontSize: "0.95rem" }}>
              <strong>Ledger History:</strong> The cryptographic proofs (transaction hashes) are permanently burned into the public Stellar ledger history and will remain verifiable indefinitely.
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              <strong>Soroban State:</strong> Active smart contract state (such as metered escrow balances) uses Soroban&apos;s Time-To-Live (TTL) rent model. This ensures that transient billing data is safely archived once the settlement window successfully closes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
