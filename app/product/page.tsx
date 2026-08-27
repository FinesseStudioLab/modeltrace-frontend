import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const m = getMessages();
  return {
    title: m.productPage.metaTitle,
    description: m.productPage.metaDescription,
  };
}

function PlannedTag({ label }: { label: string; title: string }) {
  return (
    <span
      className="tag"
      style={{
        background: "transparent",
        borderColor: "var(--muted)",
        color: "var(--muted)",
        marginLeft: "8px",
        verticalAlign: "middle",
        padding: "2px 8px",
      }}
      title={label}
    >
      {label}
    </span>
  );
}

function LiveTag({ label }: { label: string }) {
  return (
    <span
      className="tag"
      style={{
        marginLeft: "8px",
        verticalAlign: "middle",
        padding: "2px 8px",
      }}
    >
      {label}
    </span>
  );
}

export default function ProductPage() {
  const m = getMessages();
  const pp = m.productPage;

  return (
    <>
      <section className="landing-hero" style={{ paddingBottom: "24px" }}>
        <div className="landing-hero-inner" style={{ maxWidth: "800px" }}>
          <span className="tag">{pp.tag}</span>
          <h1 className="hero-headline">{pp.heroHeadline}</h1>
          <p className="landing-lead">{pp.heroLead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "12px" }}>
        <h2 style={{ marginBottom: "24px" }}>{pp.whoHeading}</h2>
        <div className="grid">
          <div className="card">
            <h3>{pp.providersTitle}</h3>
            <p style={{ marginBottom: "16px" }}>{pp.providersBody}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              <strong>{pp.providersCost.split(":")[0]}:</strong>{" "}
              {pp.providersCost.split(":").slice(1).join(":").trimStart()}
            </p>
          </div>

          <div className="card">
            <h3>{pp.buyersTitle}</h3>
            <p style={{ marginBottom: "16px" }}>{pp.buyersBody}</p>
            <ul className="list" style={{ marginTop: "12px", fontSize: "0.9rem" }}>
              <li>{pp.buyersAttestation} <LiveTag label={pp.tagLive} /></li>
              <li>{pp.buyersEscrow} <LiveTag label={pp.tagLive} /></li>
              <li>{pp.buyersPolicy} <PlannedTag label={pp.tagPlanned} title={pp.tagPlannedTitle} /></li>
            </ul>
          </div>

          <div className="card">
            <h3>{pp.auditorsTitle}</h3>
            <p style={{ marginBottom: "16px" }}>{pp.auditorsBody}</p>
            <ul className="list" style={{ marginTop: "12px", fontSize: "0.9rem" }}>
              <li>{pp.auditorsLineage} <LiveTag label={pp.tagLive} /></li>
              <li>{pp.auditorsExport} <PlannedTag label={pp.tagPlanned} title={pp.tagPlannedTitle} /></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>{pp.integrationHeading}</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          {pp.integrationLead}
        </p>
        <div className="card" style={{ padding: "24px" }}>
          <ol className="list" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>{pp.integrationStep1}</li>
            <li>{pp.integrationStep2}</li>
            <li>{pp.integrationStep3}</li>
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: "64px" }}>
        <h2>{pp.disputeHeading}</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          {pp.disputeLead}
        </p>
        <div className="card" style={{ background: "color-mix(in srgb, var(--surface) 40%, transparent)", border: "1px solid var(--ring)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h4 style={{ margin: "0 0 4px" }}>{pp.disputeScenarioTitle}</h4>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>{pp.disputeScenarioBody}</p>
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px" }}>{pp.disputeResolutionTitle}</h4>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>{pp.disputeResolutionBody1}</p>
              <p style={{ margin: "8px 0 0", fontSize: "0.95rem" }}>{pp.disputeResolutionBody2}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
