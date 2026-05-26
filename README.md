# ModelTrace — Web application (Next.js / WhoPays-grade README)

The **ModelTrace** web app — your public story, operator previews, and (soon) the dashboards that make **verifiable AI billing** on Stellar legible to buyers, vendors, and auditors.

---

## 🎯 What is this app?

This is the **Next.js 15 (App Router)** frontend for ModelTrace. It is the place where **enterprises, inference providers, and contributors** understand the product: what gets attested on-chain, how metering and settlement work, and how to participate. The Soroban contracts hold the rules; this app is the **human interface**—marketing, education, roadmap, and future signed-in operator views. Wallet-heavy or secret-bearing flows should still delegate to [`../backend/`](../backend/README.md) when you go to production.

---

## ❓ Problems the **whole protocol** tackles

From the [root README](../../README.md):

- AI procurement is scaling faster than **governance**; teams cannot consistently prove model version, region, or policy for a given output.
- Enterprises and regulated buyers need **audit trails** that survive vendor churn and spreadsheet exports.
- Usage-based billing for inference often lacks a **shared neutral layer**, increasing disputes between buyers and providers.

---

## ✅ Goals this frontend supports

- Register **signed attestations** of inference events tied to policy and pricing tiers.
- Support **metered settlement** with dispute windows and programmable payout logic on Soroban.
- Provide **operator-grade** dashboards and exports suitable for procurement and compliance reviews.
- Stay interoperable with existing inference gateways—ModelTrace is a **rail**, not a replacement model host.

---

## 💡 Why a dedicated **Next.js** frontend?

- **Trust is narrative + proof**: Grant reviewers and CISOs start on the website, not in `contracts/`.
- **Product education**: Personas for gateway teams, finance, and compliance need long-form pages (`/product`, `/compliance`).
- **Delivery transparency**: The `ExpectedPages` table on `/` tracks which routes are real vs planned—same as [`docs/SITE_MAP.md`](../../docs/SITE_MAP.md).
- **Operator UX (roadmap)**: Live usage views, export wizards, and integration guides surface here once auth lands.

---

## ✨ Features & surfaces (shipping roadmap)

- **🧭 Global shell** — `app/layout.tsx` with nav to product, contracts, operators, compliance, roadmap, contributors, docs.
- **🗺️ Live site map** — `components/expected-pages.tsx` on the home page mirrors the route backlog for stakeholders.
- **📣 Marketing & compliance story** — routes for pricing posture, audit exports narrative, and contributor onboarding (iterate content per sprint).
- **🔗 Integration posture** — docs routes explain how gateways POST usage and how disputes settle—paired with backend implementation.
- **🔐 Wallet-ready path** — scaffold assumes future Freighter/wallet connect for demos; **never** embed RPC secrets in `NEXT_PUBLIC_*`.
- **📱 Responsive UI** — CSS variables in `globals.css` per protocol theme for demos on laptop + mobile.

---

## 🏗️ Architecture

| Layer | Choice |
| ----- | ------ |
| Framework | **Next.js 15** — App Router, React 19 |
| Language | **TypeScript** (strict) |
| Styling | **CSS variables** in `app/globals.css` — protocol-specific palette |
| Components | `components/expected-pages.tsx` — **site map table** synced with [`docs/SITE_MAP.md`](../../docs/SITE_MAP.md) |
| Data | Static/scaffold today → Server Components + [`../backend/`](../backend/README.md) for authenticated flows |
| Blockchain UX | Wallet demos optional — **RPC/signing secrets stay off this bundle** |

---

## 📁 Project structure

```
apps/web/
├── app/
│   ├── layout.tsx       # Shell: metadata + nav links
│   ├── page.tsx         # Landing + <ExpectedPages /> site map
│   ├── globals.css      # Design tokens / theme
│   └── …                # Feature routes (see route tables below)
├── components/
│   └── expected-pages.tsx
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md            # ← you are here
```

---

## 🗺️ Routes

### Header navigation

| Route | Label | Notes |
| ----- | ----- | ----- |
| `/product` | Product | Primary navigation |
| `/contracts` | Contracts | Primary navigation |
| `/operators` | Operators | Primary navigation |
| `/compliance` | Compliance | Primary navigation |
| `/roadmap` | Roadmap | Primary navigation |
| `/contributors` | Contributors | Primary navigation |
| `/docs` | Docs | Primary navigation |

### Full backlog (canonical)

Authoritative **purpose + status**: [`../../docs/SITE_MAP.md`](../../docs/SITE_MAP.md).

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/` | Marketing hub + site map | Scaffold * |
| `/product` | Personas, pricing hooks, integration story | Planned |
| `/contracts` | Soroban modules and interaction flows | Planned |
| `/operators` | Dashboard preview for AI gateways | Planned |
| `/compliance` | Audit exports and policy packs | Planned |
| `/roadmap` | Milestones vs grants | Scaffold * |
| `/contributors` | Good first issues and guild roles | Planned |
| `/docs` | Technical reference hub | Scaffold * |

The **Expected pages** section on **`/`** mirrors this table so visitors see delivery honesty without opening GitHub.

---

## 🚀 Quick start

### Prerequisites

- **Node.js** 20.x or **22.x** (LTS)
- npm (pnpm/yarn OK if your org standardizes)

### Install & run (dev)

```bash
cd apps/web
npm install
npm run dev
```

Open **http://localhost:3000**

### Run **with** the API (integration dev)

```bash
# Terminal A — backend
cd ../backend && npm install && cp .env.example .env && npm run dev

# Terminal B — web (this folder)
cd ../web && npm run dev
```

Match [`../backend/README.md`](../backend/README.md) CORS origin ↔ Next origin.

---

## 📜 Available scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Dev server + hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production output |
| `npm run lint` | ESLint (`next/core-web-vitals`) |

---

## 🔐 Environment variables

### Baseline

Static scaffold needs **no secrets**. Use `.env.local` (gitignored) for optional public config.

### Planned **browser-safe** vars (`NEXT_PUBLIC_*` only)

Never put private keys or RPC URLs here.

| Variable | Example | Purpose |
| -------- | ------- | ------- |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` / `public` | Which network label the UI shows. |
| `NEXT_PUBLIC_APP_URL` | `https://…` | Canonical URL for OG tags / redirects. |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8080` | Browser-safe pointer to API when calling from client. |

---

## 🔗 Integration contract

- **REST**: Call [`apps/backend`](../backend/README.md) under `/api/v1/*` from Route Handlers or authenticated clients—never ship server secrets to `NEXT_PUBLIC_*`.
- **Soroban**: Demonstrate wallet flows with **test keys** only; production signing patterns belong in backend or secure wallets.
- **Contracts**: Rules live in [`../../contracts/`](../../contracts/) — UI reflects state via Horizon/indexers/backend.

---

## 🧪 Testing & quality gates

```bash
npm run lint
npm run build
```

Fix all ESLint + TypeScript errors before merging.

---

## 🚢 Deployment (e.g. Vercel / Netlify / Cloudflare Pages)

1. Set **build command**: `npm run build`
2. Set **output**: Next.js default (`.next`)
3. Configure **`NEXT_PUBLIC_*`** env vars per environment
4. Point **`NEXT_PUBLIC_BACKEND_URL`** at your deployed API
5. Enable **preview deployments** for grant demo links

---

## 🤝 Contributing

See [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md). UI changes should stay aligned with [`../../docs/SITE_MAP.md`](../../docs/SITE_MAP.md).

---

## 📄 License

Match repository license (Apache-2.0 common for OSS grants).

---

## 📞 Support & docs

| Resource | Link |
| -------- | ---- |
| Monorepo overview | [`../../README.md`](../../README.md) |
| Backend API | [`../backend/README.md`](../backend/README.md) |
| Site map | [`../../docs/SITE_MAP.md`](../../docs/SITE_MAP.md) |
| Layout plan | [`../../docs/layout-plan.md`](../../docs/layout-plan.md) |
| Milestones → issues | [`../../docs/milestones-issues.md`](../../docs/milestones-issues.md) |

---

**npm package:** `modeltrace-web` · **Slug:** `modeltrace` · **Stack:** Next.js App Router

**Ship it.** 🚀
