import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/docs"),
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Documentation</span>
      <h2>Technical specs, governance, and integration guides.</h2>
      <p style={{ color: "var(--muted)" }}>
        Scaffold page — replace with production content, data loaders, and analytics.
      </p>
    </section>
  );
}
