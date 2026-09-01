"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreighterConnect } from "@/components/wallet/freighter-connect";
import { navLinks } from "@/lib/site-map";

/**
 * SiteNav — primary navigation extracted from `app/layout.tsx`.
 *
 * Desktop: horizontal link row (same as before).
 * Mobile:  disclosure menu button toggles a panel below the breakpoint.
 *
 * Accessibility:
 * - Mobile toggle uses `aria-expanded` and `aria-controls`.
 * - Menu panel is labelled via `aria-labelledby`.
 * - Focus is trapped inside the menu while open and returns to the toggle
 *   on close.
 * - Escape closes the menu.
 * - The menu closes automatically on route change.
 * - The current route is marked with `aria-current="page"` and a visible style.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Unique IDs for aria wiring.
  const menuId = useId();
  const toggleId = useId();

  // -- Close on route change -------------------------------------------------
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // -- Focus management ------------------------------------------------------
  const getFocusable = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return [] as HTMLElement[];
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
  }, []);

  // Trap focus while the mobile menu is open.
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      // Only trap Tab when focus is inside the panel.
      const panelEl = panelRef.current;
      if (!panelEl || !panelEl.contains(document.activeElement)) return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Listen on document so Escape works even when focus is on the toggle.
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, getFocusable]);

  return (
    <header className="nav">
      <div className="container nav-inner">
        {/* Brand — always visible, links home. */}
        <Link href="/" className="brand brand-with-logo">
          <Image
            src="/icon.svg"
            alt=""
            width={38}
            height={38}
            className="nav-logo"
            unoptimized
          />
          <span className="brand-text">ModelTrace</span>
        </Link>

        {/* Mobile toggle button — hidden on desktop via CSS. */}
        <button
          ref={toggleRef}
          id={toggleId}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>

        {/* Desktop nav — visible on desktop, hidden on mobile. */}
        <nav className="links" aria-label="Site navigation">
          {navLinks.map(({ label, href }) => {
            const isCurrent = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? "nav-link-current" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <FreighterConnect />
      </div>

      {/* Mobile disclosure panel — visible only when open on small screens. */}
      {open && (
        <div
          ref={panelRef}
          id={menuId}
          role="navigation"
          aria-labelledby={toggleId}
          className="nav-mobile-panel"
        >
          <div className="container">
            <ul className="nav-mobile-list">
              {navLinks.map(({ label, href }) => {
                const isCurrent = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={
                        isCurrent
                          ? "nav-mobile-link nav-link-current"
                          : "nav-mobile-link"
                      }
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
