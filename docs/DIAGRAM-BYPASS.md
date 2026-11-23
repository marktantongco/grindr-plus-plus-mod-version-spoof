# Bypass decision diagram

Use before touching any broken feature. The branch point decides whether code or
config is the right lever.

```mermaid
flowchart TD
  S[Feature broken] --> Q1{Does the client gate it<br/>on roles or a flag?}
  Q1 -->|yes| A1[Axis A — client belief<br/>roles spoof / feature_flag_* / experiment_*]
  Q1 -->|no| Q2{Does the server answer 402<br/>tiered_feature?}
  Q2 -->|yes| A2[Axis B — server billing<br/>region spoof → re-session]
  Q2 -->|no| Q3{Is it a ban or version gate?}
  Q3 -->|ban| A3[Identity rotation marker<br/>+ re-login]
  Q3 -->|version| A4[Spoof pair 26.24.0 / 195444]
  Q3 -->|neither| Q4{Is the endpoint reachable<br/>and the shape known?}
  Q4 -->|yes| A5[hookService + createSuccess<br/>forge the response]
  Q4 -->|no| A6[Re-map the DEX fingerprint<br/>then forge]
  A1 --> V[Verify: log line + UI render]
  A2 --> V
  A3 --> V
  A4 --> V
  A5 --> V
  A6 --> V
  V --> R{Works?}
  R -->|no| S
  R -->|yes| D[Record in RELEASE-TIMELINE.md]
```

## Axis cheat sheet

| Axis | Lever | Cost | Reversible |
|---|---|---|---|
| A — client belief | config keys | seconds | yes, delete key |
| B — server billing | location marker | seconds | yes, revert coords |
| Identity | regen marker | seconds | no — old ID retired |
| Wire | Kotlin + rebuild | ~2 min | yes, revert commit |
| Mapping | DEX re-analysis | minutes–hours | yes |

## Anti-patterns

- Editing config while the manager runs — it overwrites from memory
- Rotating identity on a schedule — looks like a farm
- Forcing a flag the server also validates, then blaming the client
- Treating a skipped hook as a pass
