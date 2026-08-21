import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/operators"),
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Operators</span>
      <h2>Operators surface — product definition TBD.</h2>
      <p style={{ color: "var(--muted)" }}>
        Scaffold page — replace with production content, data loaders, and analytics.
      </p>
    </section>
  );
}
