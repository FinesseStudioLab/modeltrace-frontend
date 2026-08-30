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
          </tbody>
        </table>
      </div>
    </section>
  );
}
