import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/roadmap"),
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Roadmap</span>
      <h2>Milestones tied to protocol releases and grant checkpoints.</h2>
      <p style={{ color: "var(--muted)" }}>
        Scaffold page — replace with production content, data loaders, and analytics.
      </p>
    </section>
  );
}
