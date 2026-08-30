import type { Metadata } from "next";
import { ExploreClient } from "./ExploreClient";
import { getMessages } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const m = getMessages();
  return {
    title: m.explorePage.metaTitle,
    description: m.explorePage.metaDescription,
  };
}

export default function Page() {
  const m = getMessages();
  const ep = m.explorePage;

  return (
    <section className="section">
      <span className="tag">{ep.tag}</span>
      <h2>{ep.heading}</h2>
      <p style={{ color: "var(--muted)", maxWidth: 640 }}>
        {ep.lead}
      </p>
      <ExploreClient />
    </section>
  );
}
