# Bundle size budget

The site is mostly static marketing today, but the wallet SDK, charting, and
the dashboard are heavy additions. Without a budget that growth is invisible
until the site is slow. This is the budget and how it is enforced.

## Enforcement

CI runs `npm run size` (`size-limit`) against the build it just produced, in
the same job as lint/typecheck/build (`.github/workflows/ci.yml`). A pull
request that pushes any tracked group over its limit fails the check, so a
heavy dependency is caught in review rather than after release.

## Baselines

Measured with `next@15`, gzipped, on the current `main`:

| Group | Budget | Baseline | Headroom |
| --- | --- | --- | --- |
| Shared First Load JS | 300 KB | 254.2 KB | ~46 KB |
| Framework + shared runtime | 115 KB | 98.6 KB | ~16 KB |
| Marketing route chunks (`/`, `/product`, `/roadmap`, `/contributors`) | 8 KB | 0.6 KB | large |
| Docs route chunks (`/docs/**`) | 10 KB | 2.3 KB | large |
| Explore route chunk (`/explore`) | 12 KB | 1.9 KB | large |

Route budgets are deliberately tight — marketing routes are what most
visitors see and they should ship almost no client JavaScript. Raise a
budget only with a comment explaining what was added and why it is worth it.

## Analyzing a regression

When `npm run size` flags a group, find the dependency that moved it with a
one-off local analyzer run — kept out of `package.json` so CI installs stay
lean:

```bash
npm i -D @next/bundle-analyzer   # local only, do not commit
```

then wrap the export in `next.config.ts`:

```ts
import withBundleAnalyzer from "@next/bundle-analyzer";
export default withBundleAnalyzer({ enabled: true })(nextConfig);
```

and `npm run build` writes per-route treemaps to `.next/analyze/`. Revert
both once you have the answer.

## Planned follow-up

Tracked to keep this budget green as features land:

- **Analyzer in CI** — add `@next/bundle-analyzer` as a dev dependency and an
  `ANALYZE=true` build artifact once the lockfile is regenerated on the CI
  Node version, so per-route treemaps are available on every PR.
- **Wallet SDK** — `@stellar/freighter-api` / `components/wallet/*` is
  currently pulled into the shared bundle via the header. Move it behind
  `next/dynamic` (`ssr: false`) so it only loads on interaction / routes
  that connect, then add a `Wallet SDK` budget entry pointing at the split
  chunk.
- **Charting** — `components/charts/*` should load only on the dashboard,
  behind `next/dynamic`.
- Keep marketing routes as Server Components with minimal `"use client"`.
