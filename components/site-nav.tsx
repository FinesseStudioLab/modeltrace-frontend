"use client";

/**
 * SiteNav — responsive top-level navigation (#59).
 *
 * Desktop: inline link list.
 * Mobile (≤ 767px): hamburger button opens a disclosure panel that is:
 *   - keyboard accessible (focus trapped while open)
 *   - closed on Escape, outside click, or route change
 *   - focus returned to the trigger on close
 *
 * Current route is marked with `aria-current="page"` and a visible highlight.
 * Link data comes from `lib/site-map.ts` — the single source (#58).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site-map";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape; trap focus inside while open
  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    // Shift focus into the first item when the panel opens
    const focusable = getFocusable(menu);
    focusable[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const items = getFocusable(menuRef.current!);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close on outside click
  const handleOutside = useCallback((e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, handleOutside]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      triggerRef.current?.focus();
    } else {
      setOpen(true);
    }
  };

  return (
    <nav aria-label="Main navigation" style={{ position: "relative" }}>
      {/* ── Desktop link list ── */}
      <ul
        className="links site-nav-desktop"
        role="list"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className="site-nav-link"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Hamburger trigger (mobile only) ── */}
      <button
        ref={triggerRef}
        className="site-nav-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-nav-mobile"
        onClick={toggle}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>

      {/* ── Mobile disclosure panel ── */}
      {open && (
        <div
          id="site-nav-mobile"
          ref={menuRef}
          className="site-nav-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="site-nav-mobile-link"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        /* Desktop nav */
        .site-nav-desktop {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .site-nav-link {
          color: var(--text-muted);
          font-size: 0.92rem;
          padding: 4px 2px;
          border-bottom: 2px solid transparent;
          transition:
            color var(--motion-duration-fast) var(--motion-easing-standard),
            border-color var(--motion-duration-fast) var(--motion-easing-standard);
        }
        .site-nav-link:hover { color: var(--text-primary); }
        .site-nav-link[aria-current="page"] {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        /* Hamburger — hidden on desktop */
        .site-nav-burger {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 1.1rem;
          padding: 6px 10px;
          cursor: pointer;
          line-height: 1;
          transition: background var(--motion-duration-fast) var(--motion-easing-standard);
        }
        .site-nav-burger:hover {
          background: color-mix(in srgb, var(--accent) 10%, transparent);
        }

        /* Mobile disclosure panel */
        .site-nav-mobile {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: var(--surface-raised);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 8px 0;
          box-shadow: 0 8px 32px color-mix(in srgb, #000 40%, transparent);
          z-index: 100;
        }

        .site-nav-mobile-link {
          display: block;
          padding: 10px 18px;
          color: var(--text-muted);
          font-size: 0.96rem;
          transition: background var(--motion-duration-fast) var(--motion-easing-standard),
                      color var(--motion-duration-fast) var(--motion-easing-standard);
        }
        .site-nav-mobile-link:hover {
          background: color-mix(in srgb, var(--accent) 10%, transparent);
          color: var(--text-primary);
        }
        .site-nav-mobile-link[aria-current="page"] {
          color: var(--accent);
          font-weight: 600;
        }

        /* Show hamburger, hide desktop list on mobile */
        @media (max-width: 767px) {
          .site-nav-desktop { display: none; }
          .site-nav-burger  { display: inline-flex; align-items: center; }
        }
      `}</style>
    </nav>
  );
}
