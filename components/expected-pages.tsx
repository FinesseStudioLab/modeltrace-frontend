import { getMessages } from "@/lib/i18n";

export function ExpectedPages() {
  const m = getMessages();
  const ep = m.expectedPages;

  return (
    <section className="section site-map" id="site-map">
      <span className="tag">{ep.tag}</span>
      <h2>{ep.heading}</h2>
      <p style={{ color: "var(--muted)", maxWidth: 720 }}>
        {ep.intro}
      </p>
      <div style={{ overflowX: "auto", marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>{ep.colRoute}</th>
              <th>{ep.colPurpose}</th>
              <th>{ep.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {ep.rows.map((row) => (
              <tr key={row.route}>
                <td><code>{row.route}</code></td>
                <td>{row.purpose}</td>
                <td>{row.status}</td>
              </tr>
            ))}
            <tr key="/"><td><code>/</code></td><td>Marketing hub + site map</td><td>Scaffold</td></tr>
            <tr key="/product"><td><code>/product</code></td><td>Personas, pricing hooks, integration story</td><td>Planned</td></tr>
            <tr key="/contracts"><td><code>/contracts</code></td><td>Soroban modules and interaction flows</td><td>Planned</td></tr>
            <tr key="/operators"><td><code>/operators</code></td><td>Dashboard preview for AI gateways</td><td>Planned</td></tr>
            <tr key="/explore"><td><code>/explore</code></td><td>Public attestation lookup and independent verification</td><td>Shipped</td></tr>
            <tr key="/compliance"><td><code>/compliance</code></td><td>Audit exports and policy packs</td><td>Planned</td></tr>
            <tr key="/roadmap"><td><code>/roadmap</code></td><td>Milestones vs grants</td><td>Scaffold</td></tr>
            <tr key="/contributors"><td><code>/contributors</code></td><td>Good first issues and guild roles</td><td>Planned</td></tr>
            <tr key="/docs"><td><code>/docs</code></td><td>Technical reference hub</td><td>Scaffold</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
