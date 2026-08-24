/**
 * Local mirror of the deployment registry in modeltrace-contract.
 *
 * The canonical registry lives in the contracts repository as
 * `deployments/{testnet,mainnet}.json` (tracked in modeltrace-contract#62).
 * This file is shaped to be a straight copy of that record — contract id,
 * WASM hash, build commit, deploy timestamp — so that when the registry lands,
 * updating this page is a data swap, not a rewrite.
 *
 * Until the contracts are actually deployed, every address and hash below is
 * `null` and the page renders the honest "not yet deployed" state. This file
 * must never be filled with unverified values: the entire point of the page
 * is that a reader can verify the deployed bytes against the source, so an
 * unverifiable address would be worse than none.
 */

export type ContractSlug = "audit-registry" | "usage-meter" | "payment-router";
export type ContractRole = "Attestation" | "Metering" | "Settlement";

export interface ContractMeta {
  slug: ContractSlug;
  name: string;
  role: ContractRole;
  /** What the contract holds on-chain. */
  holds: string;
  /** Why this contract exists separately from the other two. */
  rationale: string;
  /** Direct link to the crate source in modeltrace-contract. */
  sourceUrl: string;
}

export const CONTRACT_META: Record<ContractSlug, ContractMeta> = {
  "audit-registry": {
    slug: "audit-registry",
    name: "Audit Registry",
    role: "Attestation",
    holds: "Signed inference events — model version, policy ref, timestamp, submitter.",
    rationale:
      "Attestation is the hottest path in the system: every inference a gateway logs becomes a record. It must be cheap, append-only, and safe to call at volume, so it stays free of money-moving logic that would force it to be conservative.",
    sourceUrl:
      "https://github.com/FinesseStudioLab/modeltrace-contract/tree/main/audit-registry",
  },
  "usage-meter": {
    slug: "usage-meter",
    name: "Usage Meter",
    role: "Metering",
    holds: "Usage units, quota buckets, pricing tiers.",
    rationale:
      "Metering converts raw attestations into billable units. It reads attestations and prices them against tiers, but it holds no funds — keeping it between the two extremes lets it change pricing without touching either escrow or the audit trail.",
    sourceUrl:
      "https://github.com/FinesseStudioLab/modeltrace-contract/tree/main/usage-meter",
  },
  "payment-router": {
    slug: "payment-router",
    name: "Payment Router",
    role: "Settlement",
    holds: "Escrow, dispute windows, payout release.",
    rationale:
      "Settlement moves money, so it must be the most conservative contract in the system: slow to act, gated by dispute windows, and rare by design. Isolating it means an upgrade or audit of money movement never touches the attestation rail.",
    sourceUrl:
      "https://github.com/FinesseStudioLab/modeltrace-contract/tree/main/payment-router",
  },
};

/** One row of the deployment registry, mirroring the contracts repo record. */
export interface DeployedContract {
  slug: ContractSlug;
  /** Soroban contract id (C…). `null` until the registry lands. */
  address: string | null;
  /** SHA-256 of the deployed WASM bytes. `null` until the registry lands. */
  wasmHash: string | null;
  /** Source commit the deployed WASM was built from. */
  commit: string | null;
  /** ISO-8601 deploy timestamp. */
  deployedAt: string | null;
}

export interface NetworkDeployments {
  network: "testnet" | "mainnet";
  label: string;
  /** Explorer prefix; the contract address is appended to build the link. */
  explorerUrl: string;
  contracts: DeployedContract[];
}

/**
 * Read by the page — never hardcode an address in JSX. When
 * modeltrace-contract#62 lands, copy the registry values in here.
 */
export const DEPLOYMENTS: NetworkDeployments[] = [
  {
    network: "testnet",
    label: "Testnet",
    explorerUrl: "https://stellar.expert/explorer/testnet/contract/",
    contracts: [
      { slug: "audit-registry", address: null, wasmHash: null, commit: null, deployedAt: null },
      { slug: "usage-meter", address: null, wasmHash: null, commit: null, deployedAt: null },
      { slug: "payment-router", address: null, wasmHash: null, commit: null, deployedAt: null },
    ],
  },
  {
    network: "mainnet",
    label: "Mainnet",
    explorerUrl: "https://stellar.expert/explorer/public/contract/",
    contracts: [
      { slug: "audit-registry", address: null, wasmHash: null, commit: null, deployedAt: null },
      { slug: "usage-meter", address: null, wasmHash: null, commit: null, deployedAt: null },
      { slug: "payment-router", address: null, wasmHash: null, commit: null, deployedAt: null },
    ],
  },
];

/** True once any contract on any network carries a real address. */
export function hasLiveDeployments(): boolean {
  return DEPLOYMENTS.some((network) =>
    network.contracts.some((c) => c.address !== null),
  );
}
