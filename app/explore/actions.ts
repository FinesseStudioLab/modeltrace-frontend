"use server";

import { headers } from "next/headers";
import { lookupAttestation, type AttestationRecord, type LookupKind } from "@/lib/api/explore";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export type LookupActionResult =
  | { status: "found"; record: AttestationRecord }
  | { status: "not_found" }
  | { status: "rate_limited"; retryAfterSeconds: number }
  | { status: "invalid" };

export async function lookupAttestationAction(
  kind: LookupKind,
  query: string,
): Promise<LookupActionResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { status: "invalid" };
  }

  const forwardedFor = (await headers()).get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() || "anonymous";
  const rateLimit = checkRateLimit(`explore:${clientKey}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rateLimit.allowed) {
    return {
      status: "rate_limited",
      retryAfterSeconds: Math.ceil(rateLimit.retryAfterMs / 1000),
    };
  }

  const result = await lookupAttestation(kind, trimmed);
  return result;
}
