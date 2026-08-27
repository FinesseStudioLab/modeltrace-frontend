import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const m = getMessages();
  return {
    title: m.compliancePage.metaTitle,
    description: m.compliancePage.metaDescription,
  };
}

export default function CompliancePage() {
  const m = getMessages();
  const cp = m.compliancePage;

  return (
    <>
      <section className="landing-hero" style={{ paddingBottom: "24px" }}>
        <div className="landing-hero-inner" style={{ maxWidth: "800px" }}>
          <span className="tag">{cp.tag}</span>
          <h1 className="hero-headline">{cp.heroHeadline}</h1>
          <p className="landing-lead">{cp.heroLead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "12px" }}>
        <h2 style={{ marginBottom: "24px" }}>{cp.evidenceHeading}</h2>
        <div className="card" style={{ marginBottom: "32px" }}>
          <p style={{ margin: 0 }}>{cp.evidenceBody}</p>
        </div>

        <h2 style={{ marginBottom: "16px" }}>{cp.sampleHeading}</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          {cp.sampleLead}
        </p>
        <div className="card" style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h4 style={{ margin: "0 0 4px" }}>{cp.sampleFileName}</h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>{cp.sampleFileDesc}</p>
          </div>
          <a
            href="/modeltrace-audit-sample.csv"
            download
            className="button"
            style={{
              display: "inline-block",
              background: "var(--fg)",
              color: "var(--bg)",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {cp.sampleDownload}
          </a>
        </div>

        <h2 style={{ marginBottom: "16px" }}>{cp.verificationHeading}</h2>
        <p style={{ color: "var(--muted)", maxWidth: "70ch", marginBottom: "24px" }}>
          {cp.verificationLead}
        </p>
        <div className="card" style={{ marginBottom: "32px", padding: "24px" }}>
          <ol className="list" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>{cp.verificationStep1}</li>
            <li>{cp.verificationStep2}</li>
            <li>{cp.verificationStep3}</li>
            <li>{cp.verificationStep4}</li>
          </ol>
        </div>

        <div className="grid">
          <div className="card">
            <h3>{cp.gdprTitle}</h3>
            <p style={{ marginBottom: "12px", fontSize: "0.95rem" }}>{cp.gdprBody1}</p>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>{cp.gdprBody2}</p>
          </div>

          <div className="card">
            <h3>{cp.retentionTitle}</h3>
            <p style={{ marginBottom: "12px", fontSize: "0.95rem" }}>{cp.retentionLedger}</p>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>{cp.retentionSoroban}</p>
          </div>
        </div>
      </section>
    </>
  );
}
