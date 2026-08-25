---
title: "Why attestation and settlement are separate contracts"
date: "2025-11-14"
type: "post"
milestone: "M1"
summary: "The attestation and settlement layers could have been one contract. Here is why we split them, what the threat model said, and what we would do differently if we started again today."
tags: ["architecture", "soroban", "attestation", "settlement"]
---

## The question we kept deferring

When you are building on Soroban and you have two closely related concerns — recording that an inference happened, and moving money as a result — the tempting path is one contract. One deploy, one upgrade path, one address to hand to integrators.

We deferred the decision through two prototype sprints. By the time we could no longer defer it, we had enough evidence to split.

## What attestation actually is

An attestation in ModelTrace is a signed, on-chain record that a specific model invocation occurred: which model, which operator tier, which policy hash, and a token-count commitment. It is write-once. It has no side effects on balances. Its job is to exist and to be queryable.

The properties we need from it:

- **Immutability.** An attested event must not be editable after the fact, even by an admin key.
- **Cheap reads.** Auditors and compliance tooling will read these records far more often than they are written.
- **No asset custody.** The attestation contract never holds XLM or any token. It cannot be drained.

## What settlement actually is

Settlement is a payment router. It takes an attested event, verifies the attestation contract confirms it, then executes a Stellar token transfer from an escrow sub-account to the operator. It has to handle partial fills, disputes, and timeouts.

The properties we need from it:

- **Upgradeability under governance.** Fee schedules change. Dispute windows change. The settlement logic must be upgradeable without touching the attestation record store.
- **Asset custody.** It holds funds in transit. It is the target of any financial attack.
- **External interface.** Enterprises integrating at the settlement layer do not need to know anything about the attestation layer's internal encoding.

## What the threat model said

The key finding from our threat model exercise (full writeup in the security folder): combining the contracts would have created a single upgrade path that, if compromised, could both rewrite history *and* redirect funds. Splitting the contracts means that compromising the settlement upgrade authority cannot touch attestation records, and vice versa.

The audit firm confirmed this was the right call. Their exact words: *"the separation meaningfully shrinks the blast radius of any single key compromise."*

## What we would do differently

The interface between the two contracts — the attestation lookup call that settlement makes — is currently tight. We pass a full event struct. If we were starting again we would pass only the event hash and let settlement maintain its own minimal index. This would let us iterate the attestation encoding without a coordinated upgrade.

We will address this in M3 when we introduce the indexer.

## Milestone note

This architecture was locked in M1. The settlement contract passed its first external review in M2. Postmortem for the one finding from that review is at [0003-audit-postmortem](/changelog/0003-audit-postmortem).
