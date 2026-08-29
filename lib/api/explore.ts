export type LookupKind = "id" | "txHash" | "payloadHash";

export type SupersessionLink = {
  id: string;
  txHash: string;
  timestamp: string;
};

export type AttestationRecord = {
  id: string;
  txHash: string;
  payloadHash: string;
  ledger: number;
  contractAddress: string;
  model: string;
  policy: string;
  payer: string;
  tokens: number;
  timestamp: string;
  /** The prior record this one corrects, if any. */
  supersedes?: SupersessionLink | null;
  /** The record that later corrected this one, if any. */
  supersededBy?: SupersessionLink | null;
};

export type AttestationLookupResult =
  | { status: "found"; record: AttestationRecord }
  | { status: "not_found" };

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = process.env.BACKEND_API_URL;

// MVP mock data so the page is demonstrable before BACKEND_API_URL is wired
// up, mirroring the fallback convention used in lib/api/operators.ts.
const MOCK_RECORDS: AttestationRecord[] = [
  {
    id: "att_1",
    txHash: "4b8292c8a1f0e6d3c9b7a5e2f1d0c8b6a4938271605f4e3d2c1b0a9887766554a",
    payloadHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    ledger: 512044,
    contractAddress: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    model: "gpt-oss-120b",
    policy: "policy_default_v2",
    payer: "Acme Corp",
    tokens: 420,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    supersedes: null,
    supersededBy: null,
  },
  {
    id: "att_2",
    txHash: "9a7d3f11b2c8e4a6d9f0c1b3a5e7d9f1b3a5c7e9d1f3b5a7c9e1d3f5b7a9c1e3f0",
    payloadHash: "3b5d5c3712955042212316173ccf37be1d1f0ba53fea9cdefff4dc6bfd6e2c9",
    ledger: 512190,
    contractAddress: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    model: "llama-3.1-70b",
    policy: "policy_default_v2",
    payer: "Globex",
    tokens: 1024,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    supersedes: null,
    supersededBy: null,
  },
  {
    id: "att_3",
    txHash: "11a0f8b2c3d4e5f60718293a4b5c6d7e8f9081726354657a8b9c0d1e2f3a4b5c6",
    payloadHash: "2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef06fdefb64a",
    ledger: 511820,
    contractAddress: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    model: "mistral-large",
    policy: "policy_strict_v1",
    payer: "Acme Corp",
    tokens: 84,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    supersedes: {
      id: "att_3_orig",
      txHash: "aa11bb22cc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    supersededBy: null,
  },
  {
    id: "att_3_orig",
    txHash: "aa11bb22cc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66",
    payloadHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d",
    ledger: 511790,
    contractAddress: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    model: "mistral-large",
    policy: "policy_strict_v1",
    payer: "Acme Corp",
    tokens: 84,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    supersedes: null,
    supersededBy: {
      id: "att_3",
      txHash: "11a0f8b2c3d4e5f60718293a4b5c6d7e8f9081726354657a8b9c0d1e2f3a4b5c6",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  },
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/^sha256:/, "");
}

function findMock(kind: LookupKind, query: string): AttestationRecord | undefined {
  const q = normalize(query);
  if (!q) return undefined;

  return MOCK_RECORDS.find((record) => {
    if (kind === "id") return record.id.toLowerCase() === q;
    if (kind === "txHash") return record.txHash.toLowerCase() === q;
    return record.payloadHash.toLowerCase() === q;
  });
}

/**
 * Looks up a single attestation by id, transaction hash, or payload hash.
 * Falls back to fixture data when BACKEND_API_URL is not configured.
 */
export async function lookupAttestation(
  kind: LookupKind,
  query: string,
): Promise<AttestationLookupResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { status: "not_found" };
  }

  if (API_URL) {
    const res = await fetch(
      `${API_URL}/explore/attestations/lookup?by=${kind}&q=${encodeURIComponent(trimmed)}`,
      { next: { revalidate: 60 } },
    );
    if (res.status === 404) {
      return { status: "not_found" };
    }
    if (!res.ok) {
      throw new Error("Failed to look up attestation");
    }
    const record = (await res.json()) as AttestationRecord;
    return { status: "found", record };
  }

  await delay(300);
  const record = findMock(kind, trimmed);
  return record ? { status: "found", record } : { status: "not_found" };
}

export function explorerTxUrl(txHash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}

export function explorerContractUrl(contractAddress: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${contractAddress}`;
}
