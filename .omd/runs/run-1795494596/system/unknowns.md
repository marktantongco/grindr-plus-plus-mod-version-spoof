# Unknown ledger (visible nodes) — run-1795494596

Every row is rendered on the page as an unlit lamp + `measuring` + condition (C-7),
never as a plausible value (P2, D-P2-1, D-15).

| node | section | what is missing | condition it waits on | currently renders |
|---|---|---|---|---|
| U-1 | §4 | official chat **close** transition | re-measure on `AE6RUT4710003613`, ≥20 samples | measuring |
| U-2 | §4 | official **profile open** transition | same | measuring |
| U-3 | §4 | mod (`.one` clone) chat open / close | same, both clone packages installed | measuring |
| U-4 | §4 | mod profile open | same | measuring |
| U-5 | §4 | p50 / p90 for every transition | ≥20 samples per transition | measuring |
| U-6 | §3 | Grindr **Xtra** tier specifics beyond what the mod repos state | Grindr public tier page, cited per row | phrased as project claims, no invented tier facts |
| U-7 | §3/§5 | server-enforced features (Viewed Me, true incognito, send entitlement, age verification) | upstream server behaviour, cannot be modded client-side | rendered as limitations, not features |
| U-8 | page | user counts, star ratings, testimonials, price | none tracked by the project | stated absent in the credit meta line, never invented |
| U-9 | §1 | legal status of shipping Grindr UI screenshots | unresolved | abstract UI + 3D only; no screenshot slot |

## Present-but-preliminary (not unknown, but bounded)

| node | value | bound | rendering |
|---|---|---|---|
| P-1 | official chat **open** | 32.3 ms, N=1, frame-delta upper bound (not tap→render) | `32.3 ms` + `single sample · frame-delta upper bound` |

## Rules

1. A measuring node may never be silently dropped to make the section look complete.
2. When a node is filled, the condition text is replaced, not merely deleted — the reader
   must still see what was measured and how many samples.
3. p50/p90 may only appear once U-5 is satisfied; until then the single value is labelled
   as a sample (D-P2-2).
