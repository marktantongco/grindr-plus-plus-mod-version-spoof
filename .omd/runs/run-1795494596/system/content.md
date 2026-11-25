# CONTENT CONTRACT (run-1795494596)

Register: technical-luxe, confident, no fluff (brand voice). User language only — no file
names, no field names, no framework words except in §2 where the stack *is* the subject
(D-P2-5, GS4). Every number traces to `data-inventory.md`; anything else is C-7 measuring.

## Voice rules

1. Short declaratives. No exclamation marks. No "revolutionary"/"seamless"/"powerful".
2. A claim without a source is demoted to a measuring state, not softened with "up to".
3. Segment copy says what the *client* gets; server-side gaps are named as gaps.
4. Second person only in the install section ("you"); elsewhere third person.

## Copy inventory (all strings authored here, no improvisation in code)

### Masthead
- Wordmark: `grindr-plus-plus-mt`
- Status: `spoof 26.24.0`
- CTA: `Get the build`
- Nav links: `Compare` · `Performance` · `Install` · `Credit`

### §1 Hero
- Eyebrow: `GPL-3.0 · fork of a fork · client-side only`
- Display: `The mod, measured.`
- Lede: `An open-source client fork for Grindr: spoofed build, rewritten experiment
  claims, and five primitives that work below the app. Numbers where we have them,
  empty lamps where we do not.`
- Action: `Get the build` · text link `Source on GitHub`
- Hero meta line: `this fork's build 26.24.0 / 195444 — upstream marks 26.23.0+ PairIP
  untested` (D-13)

### §2 Stack
- Eyebrow: `Built on`
- Title: `Rails that don't move.`
- Lines: `Next.js App Router` · `React Three Fiber + drei` · `GSAP ScrollSmoother + Remotion`
- One line each on why (authored, no vendor marketing).

### §3 Compare — three segments
- Eyebrow: `Three tiers, one device`
- Title: `What everyone gets. What money buys. What the source gives.`
- Free — term `Grindr, free` · `Ad-supported tier. Chat, browse, one album path, capped
  daily boosts.` · state `baseline`
- Xtra — term `Grindr Xtra` · `Paid tier as the mod projects describe it: more reach,
  more visibility, fewer caps.` · state `subscription`
- This fork — term `grindr-plus-plus-mt` · `Spoofed build, rewritten experiment claims,
  five client-side primitives, multi-clone. GPL-3.0.` · state `client-side`
- Under the list, the honesty block (C-7 wording): `server-enforced, no client fix —
  Viewed Me · true incognito · message-send entitlement · age verification` (D-P2-3)

### §4 Performance
- Eyebrow: `Measured, not claimed`
- Title: `Numbers, not vibes.`
- Definition lines per counter: `chat open · official client` · `chat close · official
  client` · `profile open · official client`
- Filled value: `32.3 ms` with condition `single sample · frame-delta upper bound`
- Measuring condition text: `awaiting re-measure on the test device`
- Footnote: `p50 and p90 appear once the re-measure lands.`

### §5 Features (8, from README/SUPERPOWERS)
1. `Login-gate bypass` — `Spoofed 26.24.0 baked in at compile time. No config needed.` · client-side
2. `Device identity rotation` — `A banned fingerprint becomes a new one. Rotate on ban.` · client-side
3. `Experiment override` — `Rewrites the experiments claim in the session token before the client parses it.` · client-side
4. `Role and VIP spoof` — `Unlimited role injected; VIP surfaces unlock.` · client-side
5. `Expiring media capture` — `Saved to local storage before it expires.` · client-side
6. `Unlimited chat albums` — `v2 endpoint with a local database fallback.` · client-side
7. `Always online` — `Fragile: needs location, and the first run 401s until the token refreshes.` · client-side
8. `Geo tier bypass` — `Honduras or Nigeria coordinates unlock free-account entitlements.` · client-side

### §6 Install — five steps
1. `Install the fork` — `Grab the signed build from releases.`
2. `Uninstall the stock app` — `The signature differs; Android will refuse the install otherwise.`
3. `Install and open` — `First launch writes the default config.`
4. `Open the status dialog` — `Every skipped hook is listed there. Read it before reporting.`
5. `Optional: arm a primitive` — link to the superpowers doc.

### §7 Credit
- Title: `A fork, credited.`
- Lineage: verbatim NOTICE lines (see C-8)
- Licence: `GPL-3.0, unchanged.`
- Links: `Upstream GrindrPlus` · `This fork's source`
- Meta: `build 5.0.1-26.0.1 · spoof 26.24.0 / 195444 · no affiliation with Grindr LLC`

## Forbidden strings

`revolutionary`, `seamless`, `powerful`, `10× faster`, `blazing`, `next-generation`,
`data.json`, `products.length`, any emoji as a feature icon, any star rating, any user count.
