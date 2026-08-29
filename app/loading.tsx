export default function Loading() {
  return (
    <section className="landing-hero" style={{ textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div aria-busy="true" aria-live="polite">
        <h2 className="landing-lead" style={{ opacity: 0.7, margin: 0 }}>Loading...</h2>
      </div>
    </section>
  );
}
