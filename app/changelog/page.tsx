import type { Metadata } from "next";
import Link from "next/link";
import { getAllEntries, getMilestones, formatDate } from "@/lib/changelog";
import type { EntryType } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Progress notes, architecture decisions, and postmortems for ModelTrace — tagged to grant milestones so reports assemble themselves.",
};

// Type badge colours match globals.css .cl-type-badge[data-type]
const TYPE_LABELS: Record<EntryType, string> = {
  changelog: "Changelog",
  post: "Post",
  postmortem: "Postmortem",
};

interface Props {
  searchParams: Promise<{ milestone?: string }>;
}

export default async function ChangelogIndexPage({ searchParams }: Props) {
  const { milestone: activeMilestone } = await searchParams;
  const allEntries = getAllEntries();
  const milestones = getMilestones();

  const entries = activeMilestone
    ? allEntries.filter((e) => e.milestone === activeMilestone)
    : allEntries;

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="cl-index-hero">
        <div className="landing-orbs" aria-hidden />
        <div className="cl-index-hero-inner">
          <span className="tag">Changelog</span>
          <h1 className="hero-headline">Progress, decisions, postmortems.</h1>
          <p className="landing-lead">
            Every entry is tagged to a grant milestone so a report can be
            assembled from work written as it happened, not reconstructed after
            the fact.
          </p>
          <p className="cl-rss-hint">
            <a href="/api/rss" className="cl-rss-link">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83C19.56 11.58 12.86 4.44 4 4.44zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              RSS feed
            </a>
            <span className="cl-rss-sep">·</span>
            <span>{allEntries.length} entries</span>
          </p>
        </div>
      </section>

      {/* ── Milestone filter bar ─────────────────────────────────────────── */}
      {milestones.length > 0 && (
        <nav className="cl-filter-bar" aria-label="Filter by milestone">
          <Link
            href="/changelog"
            className={`cl-filter-pill${!activeMilestone ? " cl-filter-pill--active" : ""}`}
          >
            All
          </Link>
          {milestones.map((m) => (
            <Link
              key={m}
              href={`/changelog?milestone=${encodeURIComponent(m)}`}
              className={`cl-filter-pill${activeMilestone === m ? " cl-filter-pill--active" : ""}`}
            >
              {m}
            </Link>
          ))}
        </nav>
      )}

      {/* ── Entry list ──────────────────────────────────────────────────── */}
      <section className="cl-entry-list">
        {entries.length === 0 && (
          <p className="cl-empty">No entries for this milestone yet.</p>
        )}
        {entries.map((entry) => (
          <article key={entry.slug} className="cl-card">
            <div className="cl-card-meta">
              <span
                className="cl-type-badge"
                data-type={entry.type}
              >
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

            <h2 className="cl-card-title">
              <Link href={`/changelog/${entry.slug}`}>{entry.title}</Link>
            </h2>

            <p className="cl-card-summary">{entry.summary}</p>

            {entry.tags.length > 0 && (
              <ul className="cl-tag-list" aria-label="Tags">
                {entry.tags.map((t) => (
                  <li key={t} className="cl-tag">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <Link href={`/changelog/${entry.slug}`} className="cl-read-more">
              Read →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
