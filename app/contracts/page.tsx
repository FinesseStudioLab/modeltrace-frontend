import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/contracts"),
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Contracts</span>
      <h2>Contracts surface — product definition TBD.</h2>
      <p style={{ color: "var(--muted)" }}>
        Scaffold page — replace with production content, data loaders, and analytics.
      </p>
    </section>
  );
}
