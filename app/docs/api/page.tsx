import type { Metadata } from "next";
import Link from "next/link";
import { DocsSidebar } from "../docs-sidebar";
import { DocsNext } from "../docs-next";

export const metadata: Metadata = {
  title: "API reference",
  description:
    "REST endpoints exposed by modeltrace-api today, with request and response shapes.",
};

export default function ApiPage() {
  return (
    <>
      <DocsSidebar activeHref="/docs/api" />
      <article className="docs-content">
        <span className="tag">API reference</span>
        <h1>REST API</h1>
        <p className="docs-lead">
          <code>modeltrace-api</code> is a Fastify service. Two endpoints are
          implemented today; both are unauthenticated and neither touches the
          chain. They are documented here because they are what you can actually
          call while integrating.
        </p>

        <div className="docs-note">
          <span className="docs-note-label">Route prefixes differ</span>
          <p>
            Versioned routes mount under <code>API_PREFIX</code>, which defaults to{" "}
            <code>/api/v1</code>. The health check is registered without a prefix
            and stays at <code>/health</code> regardless of how{" "}
            <code>API_PREFIX</code> is set, so that liveness probes do not have to
            track API versions.
          </p>
        </div>

        <h2>GET /health</h2>
        <p>
          Liveness check. Returns <code>200</code> whenever the process is
          accepting connections; it does not check downstream dependencies, so a
          healthy response does not imply Soroban RPC is reachable.
        </p>
        <pre className="docs-code">
          <code>{`$ curl http://localhost:8080/health

{
  "status": "ok",
  "service": "api",
  "timestamp": "2026-08-24T09:12:44.108Z"
}`}</code>
        </pre>

        <h2>GET /api/v1/meta</h2>
        <p>
          Service identity — name, version, and a one-line description. Useful for
          confirming which build an environment is running before you debug
          further up the stack.
        </p>
        <pre className="docs-code">
          <code>{`$ curl http://localhost:8080/api/v1/meta

{
  "name": "modeltrace-api",
  "version": "0.1.0",
  "description": "REST facade for Soroban contracts and indexers (scaffold)."
}`}</code>
        </pre>

        <h2>Not yet implemented</h2>
        <p>
          The capabilities below are designed and referenced elsewhere in this
          reference, but have no route in the service today. They are listed so the
          gap between the design and the build stays visible:
        </p>
        <ul>
          <li>
            <strong>Usage ingestion</strong> — authenticated endpoints for gateways
            to submit meter events for validation before attestation.
          </li>
          <li>
            <strong>Settlement preparation</strong> — returning an unsigned envelope
            for a counterparty wallet to sign, per{" "}
            <Link href="/docs/security">Key custody</Link>.
          </li>
          <li>
            <strong>Audit export jobs</strong> — asynchronous evidence packs keyed
            by buyer policy.
          </li>
          <li>
            <strong>Tenant-scoped API keys</strong> — distinct scopes for providers,
            buyers, and auditors.
          </li>
        </ul>

        <h2>Errors and logging</h2>
        <p>
          Errors return Fastify&apos;s standard JSON error shape. Log serialisation
          redacts secrets at the serializer boundary rather than at call sites,
          because credentials reach logs by being nested in a request body or
          hanging off a thrown error&apos;s context — not by being logged
          deliberately. Request headers and query strings are redacted on every
          logged request for the same reason.
        </p>

        <h2>CORS</h2>
        <p>
          The service allows a single origin, read from <code>CORS_ORIGIN</code> and
          defaulting to <code>http://localhost:3000</code>. If the web app runs on a
          different port, that variable has to match or browser calls fail
          preflight.
        </p>

        <DocsNext after="/docs/api" />
      </article>
    </>
  );
}
