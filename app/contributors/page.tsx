import type { Metadata } from "next";
import { getRouteDescription } from "@/lib/site-map";

export const metadata: Metadata = {
  description: getRouteDescription("/contributors"),
};

export default function Page() {
  return (
    <section className="section">
      <span className="tag">Contributors</span>
      <h2>Contributors surface — product definition TBD.</h2>
      <p style={{ color: "var(--muted)" }}>
        Scaffold page — replace with production content, data loaders, and analytics.
      </p>
    </section>
  );
}
