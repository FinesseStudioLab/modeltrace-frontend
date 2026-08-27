import Link from "next/link";

export default function NotFound() {
  return (
    <section className="landing-hero" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className="hero-headline">404 - Not Found</h1>
      <p className="landing-lead">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <div className="landing-cta-row" style={{ justifyContent: "center" }}>
        <Link href="/" className="cta">Return Home</Link>
      </div>
    </section>
  );
}
