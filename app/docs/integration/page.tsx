import type { Metadata } from "next";
import Link from "next/link";
import { QuickstartCompleteBeacon } from "@/components/analytics/quickstart-complete-beacon";
import { QuickstartStartBeacon } from "@/components/analytics/quickstart-start-beacon";
import { DocsSidebar } from "../docs-sidebar";
import { DocsNext } from "../docs-next";

export const metadata: Metadata = {
  title: "Integration guide",
  description:
    "Running the ModelTrace web app against a local API, the environment variables involved, and the quality gates CI enforces.",
};

export default function IntegrationPage() {
  return (
    <>
      <DocsSidebar activeHref="/docs/integration" />
      <article className="docs-content">
        <QuickstartStartBeacon />
        <span className="tag">Integration guide</span>
        <h1>Running it locally</h1>
        <p className="docs-lead">
          The web app runs standalone — it reads no environment variables today and
          calls no API. You only need the second process once you are working on
          something that talks to <code>modeltrace-api</code>.
        </p>

        <h2>Web app only</h2>
        <p>Node.js 20 or newer.</p>
        <pre className="docs-code">
          <code>{`npm ci
npm run dev     # http://localhost:3000`}</code>
        </pre>

        <h2>Web app with the API</h2>
        <pre className="docs-code">
          <code>{`# terminal A — API
cd ../modeltrace-backend
npm ci
cp .env.example .env
npm run dev     # http://localhost:8080

# terminal B — web
npm run dev     # http://localhost:3000`}</code>
        </pre>
        <p>
          The API allows one CORS origin, from <code>CORS_ORIGIN</code>. It defaults
          to <code>http://localhost:3000</code>, so the pair above works unmodified;
          if you move the web app to another port, change that variable to match or
          browser requests fail preflight.
        </p>

        <h2>Environment variables</h2>
        <div className="docs-note">
          <span className="docs-note-label">Planned, not current</span>
          <p>
            No route in this app reads <code>process.env</code> today. The variables
            below are the agreed browser-safe surface for when data loading lands —
            documented in advance so nobody invents a second convention.
          </p>
        </div>
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">Example</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>NEXT_PUBLIC_STELLAR_NETWORK</code></td>
                <td><code>testnet</code></td>
                <td>Network label shown in the UI</td>
              </tr>
              <tr>
                <td><code>NEXT_PUBLIC_APP_URL</code></td>
                <td><code>https://modeltrace.app</code></td>
                <td>Canonical URL for OG tags and redirects</td>
              </tr>
              <tr>
                <td><code>NEXT_PUBLIC_BACKEND_URL</code></td>
                <td><code>http://localhost:8080</code></td>
                <td>Browser-safe pointer to the API</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Every one of these is public by construction: the <code>NEXT_PUBLIC_</code>{" "}
          prefix inlines the value into the client bundle at build time. An RPC
          credential or signing key must never be given this prefix — privileged
          calls belong behind the API. See{" "}
          <Link href="/docs/security">Key custody</Link>.
        </p>

        <p>
          One variable is live today rather than planned:{" "}
          <code>NEXT_PUBLIC_PLAUSIBLE_DOMAIN</code> enables cookieless analytics and
          Core Web Vitals reporting when set, and both are silent no-ops when it
          isn&apos;t — nothing above depends on it, and neither does local dev.
        </p>

        <h2>Quality gates</h2>
        <p>
          CI runs exactly these five commands on every pull request, so running
          them locally reproduces it:
        </p>
        <pre className="docs-code">
          <code>{`npm run lint        # eslint
npx tsc --noEmit    # typecheck
npm test            # unit tests
npm run build       # production build
npm run size        # bundle-size budget`}</code>
        </pre>

        <h2>Adding a route</h2>
        <p>
          Create the directory under <code>app/</code> and update the route&apos;s
          status in <code>components/expected-pages.tsx</code> in the same change.
          That table is published on the home page, so leaving it stale means the
          site claims something the build does not deliver.
        </p>

        <QuickstartCompleteBeacon />
        <DocsNext after="/docs/integration" />
      </article>
    </>
  );
}
