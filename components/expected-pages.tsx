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
            <tr key="/"><td><code>/</code></td><td>Marketing hub + site map</td><td>Scaffold</td></tr>
            <tr key="/product"><td><code>/product</code></td><td>Personas, pricing hooks, integration story</td><td>Planned</td></tr>
            <tr key="/contracts"><td><code>/contracts</code></td><td>Soroban modules and interaction flows</td><td>Planned</td></tr>
            <tr key="/operators"><td><code>/operators</code></td><td>Dashboard preview for AI gateways</td><td>Planned</td></tr>
            <tr key="/explore"><td><code>/explore</code></td><td>Public attestation lookup and independent verification</td><td>Shipped</td></tr>
            <tr key="/compliance"><td><code>/compliance</code></td><td>Audit exports and policy packs</td><td>Planned</td></tr>
            <tr key="/roadmap"><td><code>/roadmap</code></td><td>Milestones vs grants</td><td>Scaffold</td></tr>
            <tr key="/contributors"><td><code>/contributors</code></td><td>Good first issues and guild roles</td><td>Planned</td></tr>
            <tr key="/docs"><td><code>/docs</code></td><td>Technical reference hub</td><td>Shipped</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
