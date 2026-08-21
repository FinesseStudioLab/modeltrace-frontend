import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ExpectedPages } from "@/components/expected-pages";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/"),
};

export default function HomePage() {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-orbs" aria-hidden />
        <div className="landing-hero-inner">
          <BrandLogo className="landing-logo" aria-label="ModelTrace logo" />
          <span className="tag">Stellar · Soroban · AI governance</span>
          <h1 className="hero-headline">Prove every inference.</h1>
          <p
            className="landing-lead"
            dangerouslySetInnerHTML={{ __html: "ModelTrace turns AI usage into <strong>attested facts on-chain</strong>: which model ran, under which policy, and what it costs\u2014so procurement, finance, and auditors share one neutral layer." }}
          />
          <div className="landing-cta-row">
            <Link href="/roadmap" className="cta">Ship the roadmap</Link>
            <Link href="/contracts" className="cta-secondary">Read the contracts story</Link>
          </div>
          <ul className="landing-stats">
            <li>Metered settlement</li>
            <li>Dispute-ready escrow</li>
            <li>Export-grade audit trails</li>
          </ul>
        </div>
      </section>

      <section className="landing-pillars">
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>◆</div>
          <h3>Attestation rail</h3>
          <p>Signed inference events tied to tiers—your billing disputes shrink.</p>
        </article>
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>◇</div>
          <h3>Settlement logic</h3>
          <p>Soroban payment-router patterns built for fast finality on Stellar.</p>
        </article>
        <article className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>○</div>
          <h3>Operator-ready UX</h3>
          <p>Roadmap toward dashboards gateways and enterprises actually adopt.</p>
        </article>
      </section>

      <p className="landing-trust">Built for teams who sell or buy inference at scale—and cannot afford black-box invoices.</p>

      <ExpectedPages />
    </>
  );
}
