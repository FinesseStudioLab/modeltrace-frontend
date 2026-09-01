"use client";

/**
 * components/analytics/tracked-links.tsx
 *
 * Thin wrappers around <a> that fire a named conversion event on click
 * before navigating. Kept as their own client components — rather than
 * attaching onClick from inside a server component's JSX — so pages that
 * render them (like the footer) don't need "use client" themselves.
 */

import type { AnchorHTMLAttributes } from "react";
import { trackRepositoryClick } from "@/lib/analytics";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function RepositoryLink({ children, onClick, ...props }: LinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackRepositoryClick();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
