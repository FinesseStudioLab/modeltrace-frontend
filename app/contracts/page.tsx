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
            <pre className="contracts-code">{`git clone https://github.com/FinesseStudioLab/modeltrace-contract
cd modeltrace-contract
rustup target add wasm32v1-none
cargo build --release --target wasm32v1-none`}</pre>
          </li>
          <li>
            Hash the artifact for the contract you want to check. The release
            profile in the workspace (opt-level z, LTO, stripped) is what makes
            the output reproducible:
            <pre className="contracts-code">{`sha256sum target/wasm32v1-none/release/audit_registry.wasm
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
      </div>
    </section>
  );
}
