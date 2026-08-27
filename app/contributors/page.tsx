import { getMessages } from "@/lib/i18n";

export default function Page() {
  const m = getMessages();
  const sp = m.scaffoldPages;

  return (
    <section className="section">
      <span className="tag">{sp.contributorsTag}</span>
      <h2>{sp.contributorsHeading}</h2>
      <p style={{ color: "var(--muted)" }}>{sp.scaffoldNotice}</p>
    </section>
  );
}
