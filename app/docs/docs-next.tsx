import Link from "next/link";
import { nextSection } from "./nav";
import type { DocsHref } from "./docs-sidebar";

/**
 * "Next" link in reading order. Renders nothing on the last section, so pages
 * can drop it in unconditionally.
 */
export function DocsNext({ after }: { after: DocsHref }) {
  const next = nextSection(after);
  if (!next) return null;

  return (
    <Link href={next.href} className="docs-next">
      <span className="docs-next-label">Next</span>
      <span className="docs-next-title">{next.title} →</span>
    </Link>
  );
}
