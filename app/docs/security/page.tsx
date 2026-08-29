import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "../docs-sidebar";
import { DocsNext } from "../docs-next";

export const metadata: Metadata = {
  title: "Key custody",
  description:
    "Why modeltrace-api never signs value movement, what the signing provider modes mean, and how attestation keys rotate.",
};

export default function SecurityPage() {
  return (
    <>
      <DocsSidebar activeHref="/docs/security" />
      <article className="docs-content">
        <span className="tag">Key custody</span>
        <h1>Signing and key custody</h1>
        <p className="docs-lead">
          <code>modeltrace-api</code> cannot move funds. Not by policy or by careful
          coding — it holds no key capable of authorising value movement. This page
          explains why that constraint exists and what it costs you as an
          integrator.
        </p>

        <h2>Two workloads, opposite risk profiles</h2>
        <p>
          Two very different kinds of chain write pass through the API, and giving
          them the same key is what creates the problem:
        </p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Attestation</th>
                <th scope="col">Settlement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frequency</td>
                <td>High — one per metered batch</td>
                <td>Low — per billing period or dispute</td>
              </tr>
              <tr>
                <td>At risk if forged</td>
                <td>Audit-record integrity</td>
                <td>Funds</td>
              </tr>
              <tr>
                <td>Latency tolerance</td>
                <td>Low — must not block metering</td>
                <td>High — a human is already in the loop</td>
              </tr>
              <tr>
                <td>Human in the loop</td>
                <td>No</td>
                <td>Yes, or an explicitly delegated policy</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Splitting them lets each path take the control that fits it. Settlement
          gets a signature from whoever holds the funds; attestation gets a scoped,
          low-privilege service key that never authorises a payment.
        </p>

        <h2>What this means for integrators</h2>
        <p>
          Settlement, refunds, and dispute payouts are returned as{" "}
          <strong>unsigned XDR envelopes</strong>. Your wallet signs and submits
          them. That is real friction, and it is deliberate: it is the reason a full
          compromise of the API cannot move your money. At worst a compromised
          service returns a <em>wrong</em> envelope, which your own review and the
          contract&apos;s authorisation checks are positioned to catch.
        </p>

        <h2>Signing provider modes</h2>
        <p>
          <code>SIGNING_PROVIDER</code> selects how the service signs attestations.
          It is the only way to reach a signature, and it exposes signing — never
          key material, so no call site can log or forward a key.
        </p>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Value</th>
                <th scope="col">Behaviour</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>null</code></td>
                <td>Default. Every signing attempt throws.</td>
                <td>
                  <span className="docs-status docs-status-implemented">Active</span>
                </td>
              </tr>
              <tr>
                <td><code>kms</code></td>
                <td>
                  Production. Signing happens inside the KMS; the key never enters
                  process memory.
                </td>
                <td>
                  <span className="docs-status docs-status-specified">
                    Interface only
                  </span>
                </td>
              </tr>
              <tr>
                <td><code>env</code></td>
                <td>
                  Local development only. Refused outright when{" "}
                  <code>NODE_ENV=production</code>.
                </td>
                <td>
                  <span className="docs-status docs-status-specified">
                    Interim risk
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The default is <code>null</code> on purpose. A service that cannot sign is
          the safe resting state, and &ldquo;signing quietly started working because
          someone set an environment variable in staging&rdquo; is precisely the
          failure this design exists to prevent. Selecting <code>env</code> under{" "}
          <code>NODE_ENV=production</code> is a <strong>startup failure</strong>,
          not a warning; outside production it logs a structured warning on every
          process start so it cannot become invisible.
        </p>

        <h2>Scope is enforced on-chain</h2>
        <p>
          The attestation key&apos;s authorisation permits attestation entry points
          only, and that restriction lives in the contract rather than in our
          conventions. A key that is merely &ldquo;used for&rdquo; attestation is one
          code change away from being used for settlement; enforcing it on-chain
          means the guarantee survives our own mistakes.
        </p>

        <h2>Key hygiene</h2>
        <ul>
          <li>
            <code>.env</code> is git-ignored; <code>.env.example</code> carries
            names and comments only.
          </li>
          <li>
            Redaction is applied at the logger&apos;s serialiser boundary, not at
            call sites — a secret reaches a log by being nested in a request body or
            a thrown error&apos;s context, never by being logged on purpose.
          </li>
          <li>
            The provider interface returns signatures and has no getter for key
            material.
          </li>
          <li>
            Signing-path errors are re-thrown with a fixed message; the underlying
            error is logged through the redacting serialiser rather than returned in
            an HTTP response.
          </li>
        </ul>

        <h2>Rotation</h2>
        <p>
          Rotation needs no downtime, because the contract accepts the new key
          before the old one is revoked:
        </p>
        <ol>
          <li>Generate the new keypair inside the KMS.</li>
          <li>Authorise its public key on the contract as an additional signer.</li>
          <li>
            Point <code>SIGNING_KMS_KEY_ID</code> at it and restart; verify on-chain
            that a fresh attestation carries the new signer.
          </li>
          <li>
            Observe one full metering cycle — anything still arriving under the old
            key means a stale instance is running.
          </li>
          <li>Revoke the old public key.</li>
          <li>Destroy the old key material, subject to audit retention.</li>
        </ol>
        <p>
          <strong>Emergency rotation</strong> runs the same steps with revocation
          before cut-over, accepting an attestation gap. A gap is backfillable from
          the metering store; a forged record is not detectable after the fact.
        </p>

        <h2>What is still open</h2>
        <p>
          The KMS provider is an interface, not an integration — the attestation
          work completes it. Multi-signature and threshold signing for settlement
          are out of scope: this design establishes only that the API is not a
          signer for value movement. See{" "}
          <Link href="/docs/contracts">Contracts</Link> for the module split that
          the same reasoning produces one layer down.
        </p>

        <DocsNext after="/docs/security" />
      </article>
    </>
  );
}
