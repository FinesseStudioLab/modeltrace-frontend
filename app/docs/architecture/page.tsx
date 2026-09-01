import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "../docs-sidebar";
import { DocsNext } from "../docs-next";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How the Soroban contracts, the modeltrace-api edge, and the Next.js web app divide responsibility.",
};

export default function ArchitecturePage() {
  return (
    <>
      <DocsSidebar activeHref="/docs/architecture" />
      <article className="docs-content">
        <span className="tag">Architecture</span>
        <h1>System architecture</h1>
        <p className="docs-lead">
          Three components, one rule for dividing them: authority sits at the layer
          that can least afford to be trusted, and everything above it is a
          convenience.
        </p>

        <h2>Components</h2>
        <div className="docs-table-wrap" tabIndex={0} role="region" aria-label="Components">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Runtime</th>
                <th scope="col">Holds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>contracts/</code></td>
                <td>Soroban (Stellar)</td>
                <td>Attestation records, metered units, escrow and payout rules</td>
              </tr>
              <tr>
                <td><code>modeltrace-api</code></td>
                <td>Fastify 5, TypeScript (strict, ESM)</td>
                <td>Vendor credentials, tenancy and quota policy, export jobs</td>
              </tr>
              <tr>
                <td><code>modeltrace-web</code></td>
                <td>Next.js 15 App Router, React 19</td>
                <td>Nothing privileged — public narrative and, later, operator views</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Request path</h2>
        <p>
          An inference gateway meters usage and reports it. The path that report
          takes is deliberately asymmetric with the path that money takes:
        </p>
        <pre className="docs-code" tabIndex={0}>
          <code>{`gateway ──POST usage──▶ modeltrace-api ──attestation──▶ audit-registry
                            │                          (signed by a scoped
                            │                           service key)
                            │
                            └──unsigned envelope──▶ counterparty wallet
                                                     │
                                                     └──signs, submits──▶ payment-router`}</code>
        </pre>
        <p>
          Attestation is high-frequency and cannot block on a human, so the API
          signs it with a key scoped on-chain to attestation entry points only.
          Settlement is low-frequency and moves funds, so the API only ever
          <em> prepares</em> it — the envelope leaves unsigned and is signed by
          whoever holds the funds. That asymmetry is the subject of{" "}
          <Link href="/docs/security">Key custody</Link>.
        </p>

        <h2>Why the web app holds nothing</h2>
        <p>
          Anything in a <code>NEXT_PUBLIC_*</code> variable is in the JavaScript
          bundle, which means it is public. That rules out RPC credentials and
          signing keys categorically, not as a matter of care. Privileged calls
          therefore go through the API, and the browser-safe variables are limited
          to labels and public URLs — see{" "}
          <Link href="/docs/integration">the integration guide</Link>.
        </p>

        <h2>Repository layout</h2>
        <div className="docs-table-wrap" tabIndex={0} role="region" aria-label="Repository layout">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Path</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>app/</code></td>
                <td>App Router routes; one directory per public surface</td>
              </tr>
              <tr>
                <td><code>app/globals.css</code></td>
                <td>Design tokens and shared component styles</td>
              </tr>
              <tr>
                <td><code>components/expected-pages.tsx</code></td>
                <td>Route delivery status, mirrored on the home page</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>components/expected-pages.tsx</code> is the contract between product
          and engineering: shipping a route means updating its status in the same
          change, so the published site map never overstates what exists.
        </p>

        <DocsNext after="/docs/architecture" />
      </article>
    </>
  );
}
