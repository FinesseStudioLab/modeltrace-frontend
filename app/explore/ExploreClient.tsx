"use client";

import { useState, useTransition } from "react";
import type { AttestationRecord, LookupKind } from "@/lib/api/explore";
import { explorerContractUrl, explorerTxUrl } from "@/lib/api/explore";
import { lookupAttestationAction, type LookupActionResult } from "./actions";

const KIND_LABELS: Record<LookupKind, string> = {
  id: "Attestation ID",
  txHash: "Transaction hash",
  payloadHash: "Payload hash",
};

function RecordCard({
  record,
  onFollow,
}: {
  record: AttestationRecord;
  onFollow: (id: string) => void;
}) {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>{record.id}</h3>
      <p style={{ color: "var(--muted)" }}>
        {record.model} · {record.policy} · {new Date(record.timestamp).toLocaleString()}
      </p>

      <div
        style={{
          overflowX: "auto",
          marginTop: 16,
        }}
      >
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Transaction</th>
              <td>
                <a
                  href={explorerTxUrl(record.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  {record.txHash}
                </a>
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Ledger</th>
              <td>{record.ledger}</td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Contract</th>
              <td>
                <a
                  href={explorerContractUrl(record.contractAddress)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  {record.contractAddress}
                </a>
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Payload hash</th>
              <td style={{ wordBreak: "break-all" }}>{record.payloadHash}</td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Model / Policy</th>
              <td>
                {record.model} / {record.policy}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {(record.supersedes || record.supersededBy) && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--border, #333)", paddingTop: 16 }}>
          <h4 style={{ margin: "0 0 8px" }}>Supersession chain</h4>
          {record.supersedes && (
            <p style={{ margin: "0 0 6px" }}>
              Corrects{" "}
              <button
                type="button"
                onClick={() => onFollow(record.supersedes!.id)}
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                {record.supersedes.id}
              </button>{" "}
              (recorded {new Date(record.supersedes.timestamp).toLocaleString()})
            </p>
          )}
          {record.supersededBy && (
            <p style={{ margin: 0 }}>
              Superseded by{" "}
              <button
                type="button"
                onClick={() => onFollow(record.supersededBy!.id)}
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                {record.supersededBy.id}
              </button>{" "}
              (recorded {new Date(record.supersededBy.timestamp).toLocaleString()})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function ExploreClient() {
  const [kind, setKind] = useState<LookupKind>("id");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<LookupActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function runLookup(nextKind: LookupKind, nextQuery: string) {
    startTransition(async () => {
      const outcome = await lookupAttestationAction(nextKind, nextQuery);
      setResult(outcome);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runLookup(kind, query);
  }

  function handleFollow(id: string) {
    setKind("id");
    setQuery(id);
    runLookup("id", id);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginTop: 20 }}
        aria-label="Attestation lookup"
      >
        <div>
          <label htmlFor="explore-kind" style={{ display: "block", marginBottom: 6, color: "var(--muted)" }}>
            Lookup by
          </label>
          <select
            id="explore-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as LookupKind)}
            style={{ padding: "10px 12px", borderRadius: 8 }}
          >
            {(Object.keys(KIND_LABELS) as LookupKind[]).map((value) => (
              <option key={value} value={value}>
                {KIND_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <label htmlFor="explore-query" style={{ display: "block", marginBottom: 6, color: "var(--muted)" }}>
            {KIND_LABELS[kind]}
          </label>
          <input
            id="explore-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Paste a${kind === "id" ? "n" : ""} ${KIND_LABELS[kind].toLowerCase()}`}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8 }}
          />
        </div>
        <button type="submit" className="cta" disabled={isPending || !query.trim()}>
          {isPending ? "Checking…" : "Verify"}
        </button>
      </form>

      <div role="status" aria-live="polite" style={{ marginTop: 8 }}>
        {result?.status === "not_found" && (
          <p style={{ color: "var(--muted)" }}>
            No attestation matches that {KIND_LABELS[kind].toLowerCase()}. Nothing was recorded for it.
          </p>
        )}
        {result?.status === "rate_limited" && (
          <p style={{ color: "var(--muted)" }}>
            Too many lookups — try again in {result.retryAfterSeconds}s.
          </p>
        )}
        {result?.status === "found" && <RecordCard record={result.record} onFollow={handleFollow} />}
      </div>
    </div>
  );
}
