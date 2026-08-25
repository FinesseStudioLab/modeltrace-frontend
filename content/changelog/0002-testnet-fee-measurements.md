---
title: "First testnet fee measurements"
date: "2025-12-03"
type: "changelog"
milestone: "M2"
summary: "We ran 2 000 simulated attestations on Stellar testnet. Here are the actual fee numbers, what surprised us, and what we are tuning before mainnet."
tags: ["testnet", "fees", "performance", "soroban"]
---

## Setup

Two thousand attestation + settlement round-trips against Stellar testnet (November 2025 network parameters). Each run: one `attest()` invocation followed immediately by one `settle()` invocation against the same event.

All measurements taken over three consecutive days to smooth out testnet load variance. Numbers below are medians; p95 figures are in the appendix.

## Results

| Operation | Median fee (stroops) | Median fee (XLM) | CPU instructions |
|---|---|---|---|
| `attest()` — write new event | 12 400 | 0.001240 | 248 000 |
| `attest()` — duplicate guard | 4 100 | 0.000410 | 82 000 |
| `settle()` — full payment | 18 700 | 0.001870 | 374 000 |
| `settle()` — dispute open | 22 100 | 0.002210 | 442 000 |
| `settle()` — dispute resolve | 19 300 | 0.001930 | 386 000 |

At these numbers, a production operator running 10 000 inferences per day would spend approximately **0.31 XLM/day** in network fees. At today's XLM price that is under $0.05/day. This is well within the budget modelled in the grant application.

## What surprised us

**Duplicate-guard path is cheap.** We expected the re-entry check in `attest()` to add meaningful overhead. It does not — the ledger key lookup is fast enough that the duplicate path costs one-third of a fresh write. This is good news: operators can safely retry attestation calls without worrying about gas amplification.

**Dispute resolution is cheaper than dispute open.** We expected the reverse. It turns out that the `dispute_open` path writes a new ledger entry for the dispute record, while `dispute_resolve` only updates a single field. The fixed cost of ledger-entry creation dominates.

## What we are tuning

1. **Event struct packing.** The current attestation struct wastes ~200 bytes on optional fields that are always empty for the common case. Removing them should drop `attest()` CPU cost by roughly 15%.

2. **Batch settlement.** We will prototype a `settle_batch([event_id])` entry point in M3. The hypothesis is that per-call overhead amortises across 10+ events in a single transaction, bringing the per-event cost down by 40–60%.

3. **Fee reserve floor.** We will add a minimum-balance check at the settlement layer so that operators approaching their fee reserve floor get an informative error rather than a silent failure.

## Next measurement checkpoint

M3 testnet, targeting January 2026. We will run the same suite against the packed struct and the batch settlement prototype.
