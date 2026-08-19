# Contributing to modeltrace-frontend

The Next.js app is where ModelTrace becomes legible: the public story for buyers
and grant reviewers, and — as auth lands — the operator dashboards and audit
exports.

## Prerequisites

- Node.js 20+

## Local workflow

```bash
npm ci
npm run dev        # http://localhost:3000

npm run lint       # eslint
npx tsc --noEmit   # typecheck
npm run build      # production build
```

All three must pass before you open a PR — CI runs exactly these.

## Review bar

- **No secrets in the bundle.** Never put an RPC credential or signing key in a
  `NEXT_PUBLIC_*` variable. Privileged calls go through `modeltrace-backend`.
- **Server Components by default.** Reach for `"use client"` only when you need
  state, effects, or browser APIs, and say why in the PR.
- **Accessible by default.** Semantic elements, labelled controls, visible focus,
  and text that meets WCAG AA contrast in both themes.
- **Keep the site map honest.** `components/expected-pages.tsx` is the contract
  between product and engineering — if you ship a route, update its status in the
  same PR.
- **No layout shift from data or fonts.** Reserve space for anything async.

## Commits and PRs

Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`). Keep PRs
scoped to one concern and open a draft early for anything architectural.
