export type TimeSeriesData = { label: string; values: number[] };

export type UsageResponse = {
  labels: string[];
  usageByModel: TimeSeriesData[];
  usageByPayer: TimeSeriesData[];
};

export type QuotaData = { used: number; limit: number; unit: string };

export type QuotasResponse = {
  attestation: QuotaData;
  export: QuotaData;
};

export type Attestation = {
  id: string;
  model: string;
  payer: string;
  timestamp: string;
  tokens: number;
  txHash: string;
};

export type RecentAttestationsResponse = {
  attestations: Attestation[];
};

export type SettlementsResponse = {
  escrowed: number;
  disputed: number;
  released: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = process.env.BACKEND_API_URL;

export async function fetchUsage(): Promise<UsageResponse> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/operators/usage`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch usage data");
    return res.json();
  }
  
  // Fallback to MVP Mock Data
  await delay(800); // Simulate network
  return {
    labels: ["W31", "W32", "W33", "W34", "W35", "W36", "W37", "W38"],
    usageByModel: [
      { label: "gpt-oss-120b", values: [180, 205, 220, 214, 246, 268, 289, 310] },
      { label: "llama-3.1-70b", values: [120, 131, 140, 148, 156, 168, 177, 188] },
      { label: "mistral-large", values: [78, 84, 92, 88, 101, 109, 115, 121] },
    ],
    usageByPayer: [
      { label: "Acme Corp", values: [200, 250, 260, 280, 300, 310, 340, 380] },
      { label: "Globex", values: [178, 170, 192, 170, 203, 235, 241, 239] },
    ]
  };
}

export async function fetchQuotas(): Promise<QuotasResponse> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/operators/quotas`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch quota data");
    return res.json();
  }
  
  await delay(600);
  return {
    attestation: { used: 690, limit: 800, unit: "events" },
    export: { used: 12, limit: 50, unit: "exports" }
  };
}

export async function fetchRecentAttestations(): Promise<RecentAttestationsResponse> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/operators/attestations?limit=10`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch attestations");
    return res.json();
  }
  
  await delay(900);
  return {
    attestations: [
      { id: "att_1", model: "gpt-oss-120b", payer: "Acme Corp", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), tokens: 420, txHash: "4b8292c8..." },
      { id: "att_2", model: "llama-3.1-70b", payer: "Globex", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), tokens: 1024, txHash: "9a7d3f11..." },
      { id: "att_3", model: "mistral-large", payer: "Acme Corp", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), tokens: 84, txHash: "11a0f8b2..." },
    ]
  };
}

export async function fetchSettlements(): Promise<SettlementsResponse> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/operators/settlements`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch settlements");
    return res.json();
  }
  
  await delay(500);
  return {
    escrowed: 45200,
    disputed: 1200,
    released: 890500
  };
}
