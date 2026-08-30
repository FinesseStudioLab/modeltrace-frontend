/**
 * English message catalogue — the single source of truth for every
 * user-facing string in the application.
 *
 * Keys are organised by feature area. Keep them stable: once a key ships it
 * becomes a contract. Add new keys freely; rename only with a deprecation
 * period so external translation tooling does not break.
 *
 * Values here are the English strings. When a second locale is added, create
 * a matching file (e.g. lib/i18n/messages/de.ts) that exports the same shape.
 */

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export const nav = {
  brand: "ModelTrace",
  product: "Product",
  contracts: "Contracts",
  operators: "Operators",
  explore: "Explore",
  compliance: "Compliance",
  roadmap: "Roadmap",
  contributors: "Contributors",
  docs: "Docs",
} as const;

// ---------------------------------------------------------------------------
// Panel states (loading / empty / error)
// ---------------------------------------------------------------------------
export const panelStates = {
  loading: "Loading data...",
  empty: "No data available yet.",
  awaitingActivity: "Awaiting activity",
  error: "Failed to load data",
  retry: "Retry",
} as const;

// ---------------------------------------------------------------------------
// Chart frame
// ---------------------------------------------------------------------------
export const chartFrame = {
  stateLoading: "Loading chart data\u2026",
  stateEmpty: "No data for this period.",
  stateError: "Chart data could not be loaded.",
  tableLabel: "Show data table",
} as const;

// ---------------------------------------------------------------------------
// Data table
// ---------------------------------------------------------------------------
export const dataTable = {
  totalRowHeader: "Total",
} as const;

// ---------------------------------------------------------------------------
// Quota gauge
// ---------------------------------------------------------------------------
export const quotaGauge = {
  toneGood: "Within quota",
  toneWarning: "Approaching limit",
  toneCritical: "At limit",
  /** Used as the SVG <title>. Placeholders: {used}, {limit}, {unit}, {percent} */
  svgTitle: "{used} of {limit}{unit} used ({percent}%)",
  fullValuesSuffix: "— full values",
  measureUsed: "Used",
  measureLimit: "Limit",
  measureRemaining: "Remaining",
} as const;

// ---------------------------------------------------------------------------
// Attestations panel
// ---------------------------------------------------------------------------
export const attestationsPanel = {
  title: "Recent Attestations",
  subtitle: "The latest validated inferences stored on-chain.",
  colTime: "Time",
  colModel: "Model",
  colPayer: "Payer",
  colTokens: "Tokens",
  colTransaction: "Transaction",
  emptyMessage: "No recent attestations.",
} as const;

// ---------------------------------------------------------------------------
// Settlements panel
// ---------------------------------------------------------------------------
export const settlementsPanel = {
  title: "Settlement Status",
  subtitle: "Overview of token flows across escrow contracts.",
  escrowed: "Escrowed",
  disputed: "Disputed",
  released: "Released",
  emptyMessage: "No settlement activity to display.",
} as const;

// ---------------------------------------------------------------------------
// Quotas panel
// ---------------------------------------------------------------------------
export const quotasPanel = {
  attestationTitle: "Attestation quota",
  exportTitle: "Export quota",
  emptyMessage: "No quota data available.",
  /** Summary template. Placeholders: {used}, {limit}, {unit}, {percent} */
  summaryNormal: "{used} of {limit} {unit} used \u2014 {percent}%",
  summaryWarning: "{used} of {limit} {unit} used \u2014 {percent}%, past the 80% warning threshold.",
} as const;

// ---------------------------------------------------------------------------
// Usage chart
// ---------------------------------------------------------------------------
export const usageChart = {
  byModel: "By Model",
  byPayer: "By Payer",
  titleByModel: "Usage by model",
  titleByPayer: "Usage by payer",
  summaryByModel: "Weekly inference volume by model.",
  summaryByPayer: "Weekly inference volume by payer.",
  emptyMessage: "No usage data recorded yet.",
} as const;

// ---------------------------------------------------------------------------
// Operators page
// ---------------------------------------------------------------------------
export const operatorsPage = {
  tag: "Operators",
  heading: "Operator dashboard",
  lead: "Attestation volume, usage by model, and quota headroom. Data is sourced directly from the testnet settlement layer.",
} as const;

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
export const homePage = {
  tag: "Stellar \u00b7 Soroban \u00b7 AI governance",
  logoAriaLabel: "ModelTrace logo",
  heroHeadline: "Prove every inference.",
  heroLead:
    "ModelTrace turns AI usage into attested facts on-chain: which model ran, under which policy, and what it costs\u2014so procurement, finance, and auditors share one neutral layer.",
  ctaPrimary: "Ship the roadmap",
  ctaSecondary: "Read the contracts story",
  statMetered: "Metered settlement",
  statEscrow: "Dispute-ready escrow",
  statAudit: "Export-grade audit trails",
  pillarAttestationIcon: "\u25c6",
  pillarAttestationTitle: "Attestation rail",
  pillarAttestationBody:
    "Signed inference events tied to tiers\u2014your billing disputes shrink.",
  pillarSettlementIcon: "\u25c7",
  pillarSettlementTitle: "Settlement logic",
  pillarSettlementBody:
    "Soroban payment-router patterns built for fast finality on Stellar.",
  pillarUXIcon: "\u25cb",
  pillarUXTitle: "Operator-ready UX",
  pillarUXBody:
    "Roadmap toward dashboards gateways and enterprises actually adopt.",
  trust:
    "Built for teams who sell or buy inference at scale\u2014and cannot afford black-box invoices.",
} as const;

// ---------------------------------------------------------------------------
// Expected pages component
// ---------------------------------------------------------------------------
export const expectedPages = {
  tag: "Site map",
  heading: "Expected pages (delivery backlog)",
  intro:
    "This table is the contract between product and engineering. Routes marked scaffold ship as placeholders; planned routes are tracked for sprint planning.",
  colRoute: "Route",
  colPurpose: "Purpose",
  colStatus: "Status",
  rows: [
    { route: "/", purpose: "Marketing hub + site map", status: "Scaffold" },
    { route: "/product", purpose: "Personas, pricing hooks, integration story", status: "Planned" },
    { route: "/contracts", purpose: "Soroban modules and interaction flows", status: "Planned" },
    { route: "/operators", purpose: "Dashboard preview for AI gateways", status: "Planned" },
    { route: "/explore", purpose: "Public attestation lookup and independent verification", status: "Shipped" },
    { route: "/compliance", purpose: "Audit exports and policy packs", status: "Planned" },
    { route: "/roadmap", purpose: "Milestones vs grants", status: "Scaffold" },
    { route: "/contributors", purpose: "Good first issues and guild roles", status: "Planned" },
    { route: "/docs", purpose: "Technical reference hub", status: "Scaffold" },
  ],
} as const;

// ---------------------------------------------------------------------------
// Product page
// ---------------------------------------------------------------------------
export const productPage = {
  tag: "Product",
  metaTitle: "Product",
  metaDescription:
    "Verifiable usage, dispute-free settlement, and immutable audit trails.",
  heroHeadline: "The Neutral Layer for AI Inference.",
  heroLead:
    "Verifiable usage, dispute-free settlement, and immutable audit trails for the next generation of AI procurement.",
  tagPlanned: "Planned",
  tagPlannedTitle: "This feature is planned and not yet live.",
  tagLive: "Live",
  whoHeading: "Who is ModelTrace for?",
  providersTitle: "AI Providers & Gateways",
  providersBody:
    "Stop fighting over spreadsheet discrepancies. ModelTrace allows you to register signed attestations of inference events directly on-chain. When usage is metered and settled via Soroban smart contracts, your invoices become cryptographically defensible.",
  providersCost:
    "Integration Cost: Minimal. You don\u2019t need to rewrite your routing layer; ModelTrace acts as an observability rail alongside your existing infrastructure.",
  buyersTitle: "Enterprise Buyers",
  buyersBody:
    "Procurement teams and regulators demand proof, not black-box API invoices. ModelTrace ensures that every billed token is tied to a specific model version, region, and policy adherence.",
  buyersAttestation: "Attestation Rail",
  buyersEscrow: "Metered Escrow Settlement",
  buyersPolicy: "Granular Policy Enforcement",
  auditorsTitle: "Auditors & Compliance",
  auditorsBody:
    "Trust is narrative plus proof. Regulators require a paper trail that survives vendor churn. By anchoring inference metadata on Stellar, auditors gain a permanent, tamper-evident ledger of AI consumption.",
  auditorsLineage: "Immutable Lineage",
  auditorsExport: "Exportable Compliance Reports",
  integrationHeading: "Concrete Integration Story",
  integrationLead:
    "What your gateway actually sends and receives. We don\u2019t require you to manage wallets or sign transactions in the hot path.",
  integrationStep1:
    "Gateway sends: A standard REST POST request to /api/v1/attest containing the inference payload: model (e.g., llama-3.1-70b), payer_id, and token_count.",
  integrationStep2:
    "ModelTrace Backend: Validates the payload, cryptographically signs it with an operator key, and queues the transaction for the Soroban network.",
  integrationStep3:
    "Gateway receives: A cryptographic receipt containing the Stellar txHash. This hash serves as the immutable proof of service, permanently linking the inference event to the pricing tier without adding latency to your user\u2019s request.",
  disputeHeading: "Dispute Resolution in Action",
  disputeLead:
    "A worked example of resolving a billing discrepancy with on-chain evidence.",
  disputeScenarioTitle: "The Scenario",
  disputeScenarioBody:
    "A provider invoices 10M tokens for a billing period, but the enterprise buyer\u2019s internal observability metrics only show 8M tokens. Without ModelTrace, this triggers a lengthy manual audit of log files and email threads.",
  disputeResolutionTitle: "The Resolution",
  disputeResolutionBody1:
    "With ModelTrace, funds are held in a Soroban escrow contract with a predefined dispute window. The enterprise buyer queries the on-chain attestations for that billing period. The ledger proves exactly 10M tokens were authorized, signed, and attested by the gateway in real-time.",
  disputeResolutionBody2:
    "Because the evidence is cryptographically verified and immutable, the dispute is programmatically dismissed based on the on-chain data, and the Soroban escrow automatically releases the funds to the provider.",
} as const;

// ---------------------------------------------------------------------------
// Compliance page
// ---------------------------------------------------------------------------
export const compliancePage = {
  tag: "Compliance",
  metaTitle: "Compliance",
  metaDescription:
    "Verifiable lineage, GDPR-compliant data residency, and deterministic evidence.",
  heroHeadline: "Cryptographic Audit Trails for AI",
  heroLead:
    "Verifiable lineage, GDPR-compliant data residency, and deterministic evidence for enterprise AI consumption.",
  evidenceHeading: "The Evidence Model",
  evidenceBody:
    "ModelTrace operates on a principle of detached cryptographic attestation. We do not store raw inference data, prompt contents, or model outputs on the ledger. Instead, the protocol produces immutable, time-stamped cryptographic receipts (SHA-256 hashes) representing the exact payload transmitted by the AI gateway. Every billed token is deterministically linked to a Stellar transaction hash, providing auditors with a tamper-evident paper trail that outlives vendor relationships.",
  sampleHeading: "Sample Audit Export",
  sampleLead:
    "What a compliance officer actually sees. Download a sample export below to review the schema and artifact format natively used by ModelTrace.",
  sampleFileName: "modeltrace-audit-sample.csv",
  sampleFileDesc:
    "Contains timestamp, payer ID, model version, tokens, payload hash, and the txHash.",
  sampleDownload: "Download CSV",
  verificationHeading: "Independent Verification",
  verificationLead:
    "How a third party verifies a row without having to trust ModelTrace or the gateway vendor.",
  verificationStep1:
    "Acquire the Export: Download the CSV audit export containing the raw payload metadata and the corresponding stellar_tx_hash.",
  verificationStep2:
    "Recompute the Hash: Locally hash the raw inference payload from your internal logs using standard SHA-256.",
  verificationStep3:
    "Query the Ledger: Query the public Stellar/Soroban ledger for the provided stellar_tx_hash.",
  verificationStep4:
    "Compare: Verify that the on-chain hash perfectly matches your locally computed hash. This mathematically proves the data existed in exactly that state at the recorded timestamp.",
  gdprTitle: "Data Residency & GDPR",
  gdprBody1:
    "Raw inference content (prompts, responses, PII) is never transmitted to or stored on the blockchain. ModelTrace only anchors one-way, irreversible cryptographic hashes.",
  gdprBody2:
    "Because the on-chain data consists strictly of anonymized identifiers and hashes, it falls outside the scope of GDPR\u2019s \u201cRight to be Forgotten.\u201d Your sensitive PII remains entirely within your secure gateway perimeter.",
  retentionTitle: "Retention Guarantees",
  retentionLedger:
    "Ledger History: The cryptographic proofs (transaction hashes) are permanently burned into the public Stellar ledger history and will remain verifiable indefinitely.",
  retentionSoroban:
    "Soroban State: Active smart contract state (such as metered escrow balances) uses Soroban\u2019s Time-To-Live (TTL) rent model. This ensures that transient billing data is safely archived once the settlement window successfully closes.",
} as const;

// ---------------------------------------------------------------------------
// Explore page
// ---------------------------------------------------------------------------
export const explorePage = {
  tag: "Explore",
  metaTitle: "Explore",
  metaDescription: "Look up and independently verify an inference attestation.",
  heading: "Verify an attestation",
  lead: "Look up any recorded attestation by its id, transaction hash, or payload hash \u2014 no account needed. Every result links back to the underlying transaction and contract so you can confirm it independently, without trusting us.",
} as const;

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
export const scaffoldPages = {
  scaffoldNotice:
    "Scaffold page \u2014 replace with production content, data loaders, and analytics.",
  contractsTag: "Contracts",
  contractsHeading: "Contracts surface \u2014 product definition TBD.",
  roadmapTag: "Roadmap",
  roadmapHeading:
    "Milestones tied to protocol releases and grant checkpoints.",
  contributorsTag: "Contributors",
  contributorsHeading: "Contributors surface \u2014 product definition TBD.",
  docsTag: "Documentation",
  docsHeading: "Technical specs, governance, and integration guides.",
} as const;

// ---------------------------------------------------------------------------
// Not-found page
// ---------------------------------------------------------------------------
export const notFoundPage = {
  headline: "404 - Not Found",
  body: "The page you are looking for doesn\u2019t exist or has been moved.",
  cta: "Return Home",
} as const;

// ---------------------------------------------------------------------------
// Error page
// ---------------------------------------------------------------------------
export const errorPage = {
  headline: "Something went wrong",
  body: "We\u2019ve encountered an unexpected issue and our team has been notified.",
  cta: "Try again",
} as const;

// ---------------------------------------------------------------------------
// Loading page
// ---------------------------------------------------------------------------
export const loadingPage = {
  label: "Loading...",
} as const;
