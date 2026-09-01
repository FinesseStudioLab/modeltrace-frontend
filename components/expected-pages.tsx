import { siteMap } from "@/lib/site-map";

/**
 * The published delivery table.
 *
 * Rows are rendered from `lib/site-map.ts` rather than kept here, because two
 * hand-maintained copies of the same contract drift — this table and the site
 * map had disagreed on the status of five routes. One list now backs the
 * table, the header nav, and the end-to-end route coverage.
 */
export function ExpectedPages() {
  return (
    <section className="section site-map" id="site-map">
      <span className="tag">Site map</span>
      <h2>Expected pages (delivery backlog)</h2>
      <p style={{ color: "var(--muted)", maxWidth: 720 }}>
        This table is the contract between product and engineering. Shipped routes carry real
        content; routes marked scaffold ship as placeholders; planned routes are tracked for
        sprint planning.
      </p>
      <div style={{ overflowX: "auto", marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {siteMap.map(({ href, purpose, status }) => (
              <tr key={href}>
                <td><code>{href}</code></td>
                <td>{purpose}</td>
                <td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
