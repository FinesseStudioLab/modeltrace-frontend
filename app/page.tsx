import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ExpectedPages } from "@/components/expected-pages";
import { Badge, Button, Card } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-orbs" aria-hidden />
        <div className="landing-hero-inner">
          <BrandLogo className="landing-logo" aria-label="ModelTrace logo" />
          <Badge className="mb-16">Stellar · Soroban · AI governance</Badge>
          <h1 className="hero-headline">Prove every inference.</h1>
          <p className="landing-lead">
            ModelTrace turns AI usage into <strong>attested facts on-chain</strong>:
            {" "}which model ran, under which policy, and what it costs{"\u2014"}so
            procurement, finance, and auditors share one neutral layer.
          </p>
          <div className="landing-cta-row">
            <Button as={Link} href="/roadmap" variant="primary">Ship the roadmap</Button>
            <Button as={Link} href="/contracts" variant="secondary">Read the contracts story</Button>
          </div>
          <ul className="landing-stats">
            <li>Metered settlement</li>
            <li>Dispute-ready escrow</li>
            <li>Export-grade audit trails</li>
          </ul>
        </div>
      </section>

      <section className="landing-pillars">
        <Card className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>◆</div>
          <h3>Attestation rail</h3>
          <p>Signed inference events tied to tiers—your billing disputes shrink.</p>
        </Card>
        <Card className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>◇</div>
          <h3>Settlement logic</h3>
          <p>Soroban payment-router patterns built for fast finality on Stellar.</p>
        </Card>
        <Card className="landing-pillar">
          <div className="landing-pillar-icon" aria-hidden>○</div>
          <h3>Operator-ready UX</h3>
          <p>Roadmap toward dashboards gateways and enterprises actually adopt.</p>
        </Card>
      </section>

      <p className="landing-trust">Built for teams who sell or buy inference at scale—and cannot afford black-box invoices.</p>

      <ExpectedPages />
    </>
  );
}

