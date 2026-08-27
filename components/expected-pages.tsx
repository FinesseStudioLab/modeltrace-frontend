import { publicRoutes } from "../lib/site-map";

export function ExpectedPages() {
  return (
    <section className="section site-map" id="site-map">
      <span className="tag">Site map</span>
      <h2>Expected pages (delivery backlog)</h2>
      <p style={{ color: "var(--muted)", maxWidth: 720 }}>
        This table is the contract between product and engineering. Routes marked scaffold ship as
        placeholders; planned routes are tracked for sprint planning.
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
            {publicRoutes.map(({ path, purpose, status }) => (
              <tr key={path}>
                <td><code>{path}</code></td>
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
