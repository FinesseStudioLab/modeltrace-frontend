---
title: "Postmortem: integer overflow in settlement fee cap"
date: "2025-12-19"
type: "postmortem"
milestone: "M2"
summary: "An external audit found a multiplication overflow in the fee-cap calculation that could have allowed operators to bypass settlement limits. Here is what happened, how we fixed it, and what we changed in our review process."
tags: ["security", "audit", "postmortem", "settlement"]
---

## Summary

During the M2 external audit, the auditor identified a u64 multiplication overflow in the `calculate_fee_cap` function of the settlement contract. Under a specific set of inputs — a very high tier multiplier combined with a large token count — the multiplication would wrap around and produce a fee cap far below the intended value. An operator aware of this could have submitted large inference batches while paying near-zero fees.

**Severity:** High  
**Status:** Fixed in commit `a3f9c21` before mainnet deployment. No funds were ever at risk on any live network.

---

## Timeline

| Time | Event |
|---|---|
| 2025-12-11 | Audit firm begins M2 review |
| 2025-12-16 | Finding reported to us over encrypted channel |
| 2025-12-16 | We reproduce the overflow locally within two hours |
| 2025-12-17 | Fix committed, internal review done |
| 2025-12-18 | Auditor confirms fix is correct |
| 2025-12-19 | Finding and fix disclosed publicly (this post) |

---

## Root cause

```rust
// BEFORE — vulnerable
let fee_cap: u64 = tier.multiplier * token_count * BASE_RATE;
```

`tier.multiplier` and `token_count` are both `u64`. For a tier multiplier of `500` and a token count of `4_000_000_000`, the product overflows u64 (max ≈ 1.8 × 10¹⁹) before the `BASE_RATE` multiplication even occurs.

In Soroban's default arithmetic mode, integer overflow panics and aborts the transaction — which means this path would have caused a denial of service for large batches, not a fee bypass. However, if the check had been compiled with wrapping arithmetic (a configuration we were evaluating for a performance branch), the overflow would produce a silently wrong result. The auditor correctly flagged both scenarios.

## Fix

```rust
// AFTER — safe
let fee_cap: u64 = tier.multiplier
    .checked_mul(token_count)
    .and_then(|v| v.checked_mul(BASE_RATE))
    .unwrap_or(u64::MAX);  // cap at maximum rather than panic or wrap
```

Using `checked_mul` at each step means overflow returns `None`, which we handle by capping at `u64::MAX` — the worst case is that a legitimately very large batch pays the maximum fee, which is acceptable behaviour.

## What we changed in our review process

1. **Arithmetic lint rule.** We added a `clippy` lint that flags any bare `*` or `+` on integer types wider than 16 bits in contract code. This would have caught the issue during internal review.

2. **Overflow test cases.** We added explicit unit tests for near-maximum inputs on all arithmetic-heavy functions. These are now required for any PR touching settlement calculations.

3. **Audit scope now includes performance branches.** We were not planning to give the auditor access to the experimental wrapping-arithmetic branch. We will from now on.

## Why we are publishing this

A clean audit record is more credible than an unbroken run of feature announcements. Anyone evaluating ModelTrace for enterprise use should know that the M2 settlement contract was reviewed externally, that a real finding was discovered, and that it was fixed and disclosed before any funds were at risk. That is how a healthy security process is supposed to work.

The full audit report is available on request.
