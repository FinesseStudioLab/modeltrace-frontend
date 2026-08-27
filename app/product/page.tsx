import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description: "Verifiable usage, dispute-free settlement, and immutable audit trails.",
};

function PlannedTag() {
  return (
    <span
      className="tag"
      style={{
        background: "transparent",
        borderColor: "var(--muted)",
        color: "var(--muted)",
        marginLeft: "8px",
        verticalAlign: "middle",
        padding: "2px 8px",
      }}
      title="This feature is planned and not yet live."
    >
      Planned
    </span>
  );
}

function LiveTag() {
  return (
    <span
      className="tag"
      style={{
        marginLeft: "8px",
        verticalAlign: "middle",
        padding: "2px 8px",
      }}
    >
      Live
    </span>
  );
}

export default function ProductPage() {
  return (
    <>
      <section className="landing-hero" style={{ paddingBottom: "24px" }}>
        <div className="landing-hero-inner" style={{ maxWidth: "800px" }}>
          <span className="tag">Product</span>
          <h1 className="hero-headline">The Neutral Layer for AI Inference.</h1>
          <p className="landing-lead">
            Verifiable usage, dispute-free settlement, and immutable audit trails for the next generation of AI procurement.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "12px" }}>
        <h2 style={{ marginBottom: "24px" }}>Who is ModelTrace for?</h2>
        <div className="grid">
          <div className="card">
            <h3>AI Providers & Gateways</h3>
            <p style={{ marginBottom: "16px" }}>
              Stop fighting over spreadsheet discrepancies. ModelTrace allows you to register signed attestations of inference events directly on-chain. When usage is metered and settled via Soroban smart contracts, your invoices become cryptographically defensible.
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              <strong>Integration Cost:</strong> Minimal. You don&apos;t need to rewrite your routing layer; ModelTrace acts as an observability rail alongside your existing infrastructure.
            </p>
          </div>

          <div className="card">
            <h3>Enterprise Buyers</h3>
            <p style={{ marginBottom: "16px" }}>
              Procurement teams and regulators demand proof, not black-box API invoices. ModelTrace ensures that every billed token is tied to a specific model version, region, and policy adherence.
            </p>
            <ul className="list" style={{ marginTop: "12px", fontSize: "0.9rem" }}>
              <li>Attestation Rail <LiveTag /></li>
              <li>Metered Escrow Settlement <LiveTag /></li>
              <li>Granular Policy Enforcement <PlannedTag /></li>
            </ul>
          </div>

          <div className="card">
            <h3>Auditors & Compliance</h3>
            <p style={{ marginBottom: "16px" }}>
              Trust is narrative plus proof. Regulators require a paper trail that survives vendor churn. By anchoring inference metadata on Stellar, auditors gain a permanent, tamper-evident ledger of AI consumption.
            </p>
            <ul className="list" style={{ marginTop: "12px", fontSize: "0.9rem" }}>
              <li>Immutable Lineage <LiveTag /></li>
              <li>Exportable Compliance Reports <PlannedTag /></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Concrete Integration Story</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          What your gateway actually sends and receives. We don&apos;t require you to manage wallets or sign transactions in the hot path.
        </p>
        <div className="card" style={{ padding: "24px" }}>
          <ol className="list" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>
              <strong>Gateway sends:</strong> A standard REST POST request to <code>/api/v1/attest</code> containing the inference payload: <code>model</code> (e.g., <code>llama-3.1-70b</code>), <code>payer_id</code>, and <code>token_count</code>.
            </li>
            <li>
              <strong>ModelTrace Backend:</strong> Validates the payload, cryptographically signs it with an operator key, and queues the transaction for the Soroban network.
            </li>
            <li>
              <strong>Gateway receives:</strong> A cryptographic receipt containing the Stellar <code>txHash</code>. This hash serves as the immutable proof of service, permanently linking the inference event to the pricing tier without adding latency to your user&apos;s request.
            </li>
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: "64px" }}>
        <h2>Dispute Resolution in Action</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          A worked example of resolving a billing discrepancy with on-chain evidence.
        </p>
        <div className="card" style={{ background: "color-mix(in srgb, var(--surface) 40%, transparent)", border: "1px solid var(--ring)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h4 style={{ margin: "0 0 4px" }}>The Scenario</h4>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                A provider invoices 10M tokens for a billing period, but the enterprise buyer&apos;s internal observability metrics only show 8M tokens. Without ModelTrace, this triggers a lengthy manual audit of log files and email threads.
              </p>
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px" }}>The Resolution</h4>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                With ModelTrace, funds are held in a Soroban escrow contract with a predefined dispute window. The enterprise buyer queries the on-chain attestations for that billing period. The ledger proves exactly 10M tokens were authorized, signed, and attested by the gateway in real-time.
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "0.95rem" }}>
                Because the evidence is cryptographically verified and immutable, the dispute is programmatically dismissed based on the on-chain data, and the Soroban escrow automatically releases the funds to the provider.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
