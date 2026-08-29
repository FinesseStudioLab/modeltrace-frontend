import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "../docs-sidebar";
import { DocsNext } from "../docs-next";

export const metadata: Metadata = {
  title: "Contracts",
  description:
    "The audit-registry, usage-meter, and payment-router Soroban modules and the responsibilities each one owns.",
};

export default function ContractsPage() {
  return (
    <>
      <DocsSidebar activeHref="/docs/contracts" />
      <article className="docs-content">
        <span className="tag">Contracts</span>
        <h1>Soroban modules</h1>
        <p className="docs-lead">
          Three modules, split by what each one is trusted to decide. The split
          matters more than any individual entry point: it is what keeps a
          compromise of the metering path away from the funds path.
        </p>

        <div className="docs-note">
          <span className="docs-note-label">Status — specified</span>
          <p>
            This page describes the agreed contract design and the API
            responsibilities that pair with it. The Soroban crates are not yet
            implemented in the repository, so treat entry-point names as the
            specification rather than as a stable ABI.
          </p>
        </div>

        <h2>Division of responsibility</h2>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Module</th>
                <th scope="col">Owns</th>
                <th scope="col">API responsibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>audit-registry</code></td>
                <td>
                  The attestation record: which model ran, under which policy, and
                  the hash committing to the event
                </td>
                <td>
                  Receives signed payloads from trusted gateways, validates the
                  schema, forwards to simulation and submit
                </td>
              </tr>
              <tr>
                <td><code>usage-meter</code></td>
                <td>
                  Billable units accrued per tenant and tier, and quota state
                </td>
                <td>
                  Aggregates server-side where batching is needed, reconciles quota
                  with contract reads and writes
                </td>
              </tr>
              <tr>
                <td><code>payment-router</code></td>
                <td>
                  Escrow, dispute windows, and the conditions under which a payout
                  releases
                </td>
                <td>
                  Prepares payout and dispute transactions as unsigned envelopes;
                  never submits them itself
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Why three modules and not one</h2>
        <p>
          A single contract holding attestation, metering, and settlement would give
          every caller on the high-frequency metering path a code path into the
          funds logic. Splitting them means the authorisation surface for moving
          money is small enough to reason about, and stays that way as the metering
          surface grows.
        </p>
        <p>
          The same reasoning drives the key custody decision one layer up: two
          workloads with opposite risk profiles should not share a key. See{" "}
          <Link href="/docs/security">Key custody</Link>.
        </p>

        <h2>Dispute window</h2>
        <p>
          Settlement is not immediate. A payout enters escrow and becomes claimable
          only after its dispute window closes, which gives a buyer a bounded period
          to contest a metered total against the attestation record backing it.
          Because both sides read the same on-chain record, a dispute is a
          disagreement about policy rather than about what happened.
        </p>

        <DocsNext after="/docs/contracts" />
      </article>
    </>
  );
}
