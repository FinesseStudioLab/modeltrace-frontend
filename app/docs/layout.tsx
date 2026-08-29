import "./docs.css";

/**
 * Two-column shell for the docs subtree.
 *
 * The sidebar is rendered by each page rather than here, because marking the
 * active link needs the current route: doing that in the layout would mean
 * `usePathname()` and a client bundle for what is a static list of links.
 * Pages pass their own `activeHref` to <DocsSidebar /> instead, which keeps
 * the whole subtree server-rendered.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <div className="docs-shell">{children}</div>;
}
