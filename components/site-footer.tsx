/**
 * components/site-footer.tsx
 *
 * The site had no footer at all, and no link back to the project's own
 * source anywhere in the app — which left "repository clicks" in the issue's
 * list of conversions to track with nothing to actually track. This adds the
 * minimal real thing: one link, wired to trackRepositoryClick.
 */

import { RepositoryLink } from "@/components/analytics/tracked-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>ModelTrace — verifiable AI inference accounting on Stellar.</span>
        <RepositoryLink
          href="https://github.com/FinesseStudioLab/modeltrace-frontend"
          className="site-footer-link"
        >
          View source on GitHub
        </RepositoryLink>
      </div>
    </footer>
  );
}
