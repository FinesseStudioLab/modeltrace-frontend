import Link from "next/link";
import { docsSections } from "./nav";

/** Href of a real docs section — keeps `activeHref` honest at compile time. */
export type DocsHref = (typeof docsSections)[number]["href"];

export function DocsSidebar({ activeHref }: { activeHref?: DocsHref }) {
  return (
    <nav className="docs-sidebar" aria-label="Documentation sections">
      <p className="docs-sidebar-heading" id="docs-nav-heading">
        Reference
      </p>
      <ol aria-labelledby="docs-nav-heading">
        <li>
          <Link href="/docs" aria-current={activeHref ? undefined : "page"}>
            Overview
          </Link>
        </li>
        {docsSections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              aria-current={section.href === activeHref ? "page" : undefined}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
