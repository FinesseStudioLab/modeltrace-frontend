import { DocsEntryBeacon } from "@/components/analytics/docs-entry-beacon";
import { Quickstart } from "@/components/analytics/quickstart";

export default function Page() {
  return (
    <section className="section">
      <DocsEntryBeacon />
      <span className="tag">Documentation</span>
      <h2>Technical specs, governance, and integration guides.</h2>
      <p style={{ color: "var(--muted)" }}>
        Full technical reference is on the roadmap — start here in the meantime.
      </p>
      <Quickstart />
    </section>
  );
}
