import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ExpectedPages } from "@/components/expected-pages";
import { getMessages } from "@/lib/i18n";

export default function HomePage() {
  const m = getMessages();
  const hp = m.homePage;

  return (
    <>
      <section className="landing-hero">
        <div className="landing-orbs" aria-hidden />
        <div className="landing-hero-inner">
          <BrandLogo className="landing-logo" aria-label={hp.logoAriaLabel} />
          <span className="tag">{hp.tag}</span>
          <h1 className="hero-headline">{hp.heroHeadline}</h1>
          <p className="landing-lead">{hp.heroLead}</p>
          <div className="landing-cta-row">
            <Link href="/roadmap" className="cta">{hp.ctaPrimary}</Link>
            <Link href="/contracts" className="cta-secondary">{hp.ctaSecondary}</Link>
          </div>
          <ul className="landing-stats">
            <li>{hp.statMetered}</li>
            <li>{hp.statEscrow}</li>
            <li>{hp.statAudit}</li>
          </ul>
        </div>
      </section>

      <section className="landing-pillars">
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>{hp.pillarAttestationIcon}</div>
          <h3>{hp.pillarAttestationTitle}</h3>
          <p>{hp.pillarAttestationBody}</p>
        </article>
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>{hp.pillarSettlementIcon}</div>
          <h3>{hp.pillarSettlementTitle}</h3>
          <p>{hp.pillarSettlementBody}</p>
        </article>
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>{hp.pillarUXIcon}</div>
          <h3>{hp.pillarUXTitle}</h3>
          <p>{hp.pillarUXBody}</p>
        </article>
      </section>

      <p className="landing-trust">{hp.trust}</p>

      <ExpectedPages />
    </>
  );
}
