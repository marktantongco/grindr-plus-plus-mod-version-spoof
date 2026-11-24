# omd-autopilot prompt — grindr-plus-plus-mt 3D award landing

## Mode
🐬 Creative → 🦅 Strategy → 🦫 Builder → 🐘 Memory

## Objective
Create an award-winning 3D cinematic landing page for grindr-plus-plus-mt that presents the Grindr Free / Grindr Xtra / Grindr Mod mtantongco ecosystem as a premium product showcase. The page must be a scroll-native 3D film with layered parallax, 3D infographics, and a motion video comparison of chat/profile snappiness.

## Research orchestration — do BEFORE design

Run in parallel:
1. `parallel-deep-research` — current 3D landing best practices, award criteria, 60fps mobile patterns
2. `github-research` — fatterdev/grindr-plus-plus, gustarmartins/GrindrPlus v5.0.1, R0rt1z2/GrindrPlus, ElJaviLuki/GrindrPlus. Extract hook architecture, version spoof, JWT experiment engine
3. `investigate` — measure official Grindr chat vs Grindr Plus mod transition latency. Capture chat window open/close and profile view transition times in ms
4. `brainstorming` — 3 materially different visual concepts for the 3-segment comparison
5. `orchestrate` — coordinate sub-agents: 3D asset pipeline, Remotion video, GSAP timelines, design system

Store findings in agentmemory with keys: research_3d_landings, grindr_plus_lineage, perf_measurements.

## DESIGN.md tokens — pre-filled

brand:
  name: grindr-plus-plus-mt
  tagline: Fork of Grindr++ · Spoof 26.24.0/195444 · JWT experiment engine
  palette:
    bg: "#12100f"
    panel: "#1d1613"
    ink: "#f4ece6"
    muted: "#a08b7f"
    accent: "#ff8a3d"
    accent_light: "#ffb887"
  type:
    heading: ui-monospace
    body: ui-sans-serif
  radius: 14
  motion:
    easing: "power2.out"
    duration: 0.6
  accessibility:
    reduced_motion: true
    contrast: 4.5
content_locales:
  voice: technical-luxe, confident, no fluff

Page structure — scroll film
1. Hero — volumetric Grindr Plus mark, fog, parallax depth
2. Stack — Next.js App Router + Tailwind + GSAP + @gsap/react + R3F/drei + Spline + Remotion as floating 3D cards
3. 3-Segment Infographic — Grindr Free vs Grindr Xtra vs Grindr Mod mtantongco
   - Pros/cons per segment, extracted from research
   - 3D animated bar chart + rotating comparison prism
4. Performance Proof — Official vs Mod snappiness
   - Measured ms for chat window open/close and profile view transition
   - Remotion micro-animation + GSAP counters
5. Superpowers — device ID rotation, JWT experiment override, feature flags, response forging, geo tier bypass
6. Timeline / Install — beginner + expert
7. Fork credit — NOTICE + GPL-3.0

3-Segment infographic requirements
Create a 3D animated infographic comparing:
- Grindr Free
- Grindr Xtra
- Grindr Mod mtantongco
Data points per segment: messaging limits, photos/videos, albums, boosting, paywall, experiments override, device ban bypass, latency, privacy.
Present as:
- 3D rotating tri-prism with each face = one segment
- GSAP scroll-triggered reveal with data-speed parallax
- Remotion motion video export for the comparison section

Performance comparison
- Measure official Grindr chat vs mod chat transition times in ms
- Visualise as 3D animated graphic arts:
  - Side-by-side timelines with animated bars, easing curves, frame counters
  - GSAP-driven number counters
  - Remotion-rendered chat window and profile view morph

Technical constraints
- Next.js App Router + Tailwind + GSAP + @gsap/react + R3F/drei + Spline embed + Remotion
- ScrollSmoother for smooth scroll + data-speed / data-lag
- 60fps mobile: cap DPR, drei <Performance>, GLB <1 MB, isWebGLAvailable fallback, prefers-reduced-motion kills ScrollSmoother
- Blender assets exported as compressed GLB, Spline for lightweight interactions

Deliverables
- DESIGN.md updated with tokens above
- /app/page.tsx scroll film with ScrollSmoother
- R3F scenes for hero, tri-prism, performance viz
- Remotion compositions for ms comparison video
- GSAP timelines for scroll reveals and counters
- Fork notice + upstream credit block
- Final QA via omd-designer-review + omd-final-qa

Verification
- Session experiments rewritten log present
- 3D scenes load <1.5s on mobile 4G
- Reduced motion respects prefers-reduced-motion
- Credit block renders verbatim

Proceed with omd-autopilot guided checkpoints: Discovery → Wireframe → Components → Microcopy → Validation.
