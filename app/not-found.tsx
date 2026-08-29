import Link from "next/link";
import { getMessages } from "@/lib/i18n";

export default function NotFound() {
  const m = getMessages();
  const nf = m.notFoundPage;

  return (
    <section className="landing-hero" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className="hero-headline">{nf.headline}</h1>
      <p className="landing-lead">{nf.body}</p>
      <div className="landing-cta-row" style={{ justifyContent: "center" }}>
        <Link href="/" className="cta">{nf.cta}</Link>
      </div>
    </section>
  );
}
