import type { Metadata } from "next";
import Link from "next/link";
import { getAllEntries, getEntryBySlug, formatDate } from "@/lib/changelog";
import type { EntryType } from "@/lib/changelog";
import { notFound } from "next/navigation";

const TYPE_LABELS: Record<EntryType, string> = {
  changelog: "Changelog",
  post: "Post",
  postmortem: "Postmortem",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: "article",
      publishedTime: entry.date,
    },
  };
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <article className="cl-post">
      {/* ── Back navigation ─────────────────────────────────────────────── */}
      <Link href="/changelog" className="cl-back-link">
        ← Changelog
      </Link>

      {/* ── Post header ─────────────────────────────────────────────────── */}
      <header className="cl-post-header">
        <div className="cl-post-meta">
          <span className="cl-type-badge" data-type={entry.type}>
            {TYPE_LABELS[entry.type]}
          </span>
          {entry.milestone && (
            <Link
              href={`/changelog?milestone=${encodeURIComponent(entry.milestone)}`}
              className="cl-milestone-chip"
            >
              {entry.milestone}
            </Link>
          )}
          <time dateTime={entry.date} className="cl-date">
            {formatDate(entry.date)}
          </time>
        </div>

        <h1 className="cl-post-title">{entry.title}</h1>
        <p className="cl-post-summary">{entry.summary}</p>

        {entry.tags.length > 0 && (
          <ul className="cl-tag-list" aria-label="Tags">
            {entry.tags.map((t) => (
              <li key={t} className="cl-tag">
                {t}
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* ── Post body ───────────────────────────────────────────────────── */}
      <div
        className="cl-post-body prose"
        dangerouslySetInnerHTML={{ __html: entry.body }}
      />

      {/* ── Footer navigation ───────────────────────────────────────────── */}
      <footer className="cl-post-footer">
        <Link href="/changelog" className="cl-back-link">
          ← Back to Changelog
        </Link>
        <a href="/api/rss" className="cl-rss-link">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="6.18" cy="17.82" r="2.18" />
            <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83C19.56 11.58 12.86 4.44 4 4.44zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
          </svg>
          Subscribe via RSS
        </a>
      </footer>
    </article>
  );
}
