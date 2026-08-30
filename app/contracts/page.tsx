import type { Metadata } from "next";
import Link from "next/link";
import { CONTRACT_META, hasLiveDeployments } from "./deployments";
import { DeploymentTable } from "@/components/deployment-table";
import { FlowDiagram } from "@/components/flow-diagram";

export const metadata: Metadata = {
  title: "Contracts",
  description:
    "The three ModelTrace contracts — audit-registry, usage-meter, payment-router — why they are separate, where they are deployed, and how to verify the deployed bytes yourself.",
};

const CONTRACT_ORDER = ["audit-registry", "usage-meter", "payment-router"] as const;

const REGISTRY_ISSUE_URL =
  "https://github.com/FinesseStudioLab/modeltrace-contract/issues/62";
const CONTRACTS_REPO_URL = "https://github.com/FinesseStudioLab/modeltrace-contract";
const CONTRACTS_STATUS_URL =
  "https://github.com/FinesseStudioLab/modeltrace-contract#current-status";

export default function Page() {
  const live = hasLiveDeployments();

  return (
    <section className="section">
      <span className="tag">Contracts</span>
      <h2>The contracts behind ModelTrace</h2>
      <p className="contracts-lead">
        ModelTrace&apos;s rules live in three Soroban contracts on Stellar:
        attestation, metering, and settlement. They are deliberately separate —
        attestation is cheap and frequent, settlement is conservative and rare —
        so each one can be reasoned about and audited on its own.
      </p>

      {/* Why three contracts */}
      <div className="contracts-grid">
        {CONTRACT_ORDER.map((slug) => {
          const meta = CONTRACT_META[slug];
          return (
            <article className="card contract-card" key={slug}>
              <span className="contract-role">{meta.role}</span>
              <h3>{meta.name}</h3>
              <p>{meta.holds}</p>
              <p className="contract-rationale">{meta.rationale}</p>
              <a className="contract-source" href={meta.sourceUrl} target="_blank" rel="noreferrer">
                Read the source →
              </a>
            </article>
          );
        })}
      </div>
      <p className="contracts-separation">
        One rule of thumb ties the design together: the closer a contract gets
        to moving money, the slower and more careful it must be. Attestations
        are written on every inference and never cost anything to dispute;
        settlements move funds, so they wait out a dispute window and only fire
        when the case is clear.
      </p>

      {/* Live deployments */}
      <div className="contracts-block">
        <h3>Deployed addresses</h3>
        <p className="contracts-sub">
          Addresses and WASM hashes below are read from the deployment registry,
          not hardcoded in this page. Each address links to its explorer entry.
        </p>
        {!live ? (
          <div className="deploy-notice" role="status">
            <strong>Not yet deployed.</strong> The contracts are compiling
            scaffolds today, and the deployment registry they will be published
            in is tracked in{" "}
            <a href={REGISTRY_ISSUE_URL} target="_blank" rel="noreferrer">
              modeltrace-contract#62
            </a>
            . This page goes live the moment that registry lands — no page
            rewrite needed.
          </div>
        ) : null}
        <DeploymentTable />
      </div>

      {/* Verify it yourself */}
      <div className="contracts-block">
        <h3>Verify it yourself</h3>
        <p className="contracts-sub">
          The WASM hash next to each address is a SHA-256 of the deployed
          bytes. Rebuild from source and compare — if the hashes match, the
          deployed contract is exactly what the source says it is.
        </p>
        <ol className="contracts-steps">
          <li>
            Clone and build the contracts with the pinned toolchain (requires
            Rust 1.84+ and the Soroban WASM target):
            {/* Scrolls on narrow screens (unbreakable command lines), so it
                needs a tab stop to satisfy axe's scrollable-region-focusable. */}
            <pre className="contracts-code" tabIndex={0}>{`git clone https://github.com/FinesseStudioLab/modeltrace-contract
cd modeltrace-contract
rustup target add wasm32v1-none
cargo build --release --target wasm32v1-none`}</pre>
          </li>
          <li>
            Hash the artifact for the contract you want to check. The release
            profile in the workspace (opt-level z, LTO, stripped) is what makes
            the output reproducible:
            <pre className="contracts-code" tabIndex={0}>{`sha256sum target/wasm32v1-none/release/audit_registry.wasm
sha256sum target/wasm32v1-none/release/usage_meter.wasm
sha256sum target/wasm32v1-none/release/payment_router.wasm`}</pre>
          </li>
          <li>
            Compare each result with the WASM hash in the table above. A match
            means the bytes on-chain were built from this source at the
            recorded commit. Use the Soroban WASM target{" "}
            <code>wasm32v1-none</code> — <code>wasm32-unknown-unknown</code>{" "}
            produces bytes the network rejects.
          </li>
        </ol>
      </div>

      {/* Flow */}
      <div className="contracts-block">
        <h3>How an inference flows through</h3>
        <FlowDiagram />
      </div>

      {/* Source & audit status */}
      <div className="contracts-block">
        <h3>Source and audit status</h3>
        <p className="contracts-sub">
          The contracts are open source under Apache-2.0. They are currently
          compiling scaffolds — real domain entrypoints, authorization, and
          tests are tracked as open issues in the contracts repository.
        </p>
        <div className="contracts-links">
          <a className="cta-secondary" href={CONTRACTS_REPO_URL} target="_blank" rel="noreferrer">
            modeltrace-contract on GitHub
          </a>
          <a className="cta-secondary" href={CONTRACTS_STATUS_URL} target="_blank" rel="noreferrer">
            Audit status
          </a>
          <Link className="cta-secondary" href="/roadmap">
            Production milestones
          </Link>
        </div>
import { Address, Hash } from "@/components/address-hash";

// Synthetic but realistic-length values for the demo.
const CONTRACT_ID =
  "CBIELTK6YBZJU5UP2WWQEQDYCBV6ARSGXWC7KXFWOVMQNQIYUQHFZN3";
const TREASURY_ID =
  "GDQJUTQYK2MQX2ZJARTDFEFYMBPI7KXFVGATXHEWWGIMR3MG76BCBKD";
const TX_HASH =
  "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

export default function ContractsPage() {
  return (
    <section className="section">
      <span className="tag">Contracts</span>
      <h1>Soroban contracts</h1>
      <p style={{ color: "var(--muted)", maxWidth: 640, marginTop: 0 }}>
        On-chain modules that power ModelTrace settlement, attestation, and
        escrow. Production addresses and interaction flows ship with the
        Soroban milestone.
      </p>

      {/* ── Component preview ── */}
      <div
        style={{
          marginTop: 32,
          padding: "22px 24px",
          borderRadius: 14,
          border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)",
          background:
            "linear-gradient(165deg, color-mix(in srgb, var(--surface) 92%, var(--bg)) 0%, var(--surface) 100%)",
        }}
      >
        <p
          className="tag"
          style={{ display: "inline-block", marginBottom: 16 }}
        >
          Address &amp; Hash primitives
        </p>
        <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)", marginTop: 0, marginBottom: 20 }}>
          Every address and hash on this platform uses the shared{" "}
          <code style={{ fontSize: "inherit" }}>&lt;Address&gt;</code> /{" "}
          <code style={{ fontSize: "inherit" }}>&lt;Hash&gt;</code> component:
          truncated with both head and tail visible, copyable, and
          screen-reader-annotated with the full value.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "var(--text-sm)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Label
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Address — no explorer link */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Attestation contract
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Address value={CONTRACT_ID} />
              </td>
            </tr>

            {/* Address — with explorer link */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Treasury (testnet)
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Address
                  value={TREASURY_ID}
                  explorerHref={`https://stellar.expert/explorer/testnet/account/${TREASURY_ID}`}
                />
              </td>
            </tr>

            {/* Transaction hash */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                Last settlement tx
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--muted) 15%, transparent)",
                }}
              >
                <Hash
                  value={TX_HASH}
                  explorerHref={`https://stellar.expert/explorer/testnet/tx/${TX_HASH}`}
                />
              </td>
            </tr>

            {/* Missing-value fallback */}
            <tr>
              <td
                style={{
                  padding: "10px 12px",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Escrow contract
              </td>
              <td style={{ padding: "10px 12px" }}>
                {/* Intentionally null — component renders the safe fallback */}
                <Address value={null} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
