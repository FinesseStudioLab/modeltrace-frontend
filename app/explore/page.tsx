import type { Metadata } from "next";
import { ExploreClient } from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore",
  description: "Look up and independently verify an inference attestation.",
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Explore</span>
      <h1>Verify an attestation</h1>
      <p style={{ color: "var(--muted)", maxWidth: 640 }}>
        Look up any recorded attestation by its id, transaction hash, or payload hash — no
        account needed. Every result links back to the underlying transaction and contract so you
        can confirm it independently, without trusting us.
      </p>
      <ExploreClient />
    </section>
  );
}
