# 3D landing research — librarian findings (condensed, ses_df4042c4bffe9C10m1gRpQ3CnI, 2026-11-24)

## Version matrix (build-pinning constraints → D-06)
```
react / react-dom   19.2.x  HARD: fiber peer >=19 <19.4 (fiber <9.8.0 breaks at 19.3 useTransition)
@react-three/fiber  9.8.2   (>=9.8.0 required for React 19.3; #3915/#3916)
@react-three/drei   10.7.9  (peer fiber ^9, three >=0.159)
three               >=0.159 (WebGPU/TSL prod since r171)
gsap                3.15.x  — now 100% free incl. all plugins (Webflow/GreenSock 2024)
@gsap/react         2.1.2   SSR-safe, auto-cleanup via gsap.context
@remotion/*         v5.0 terms: Free License covers teams ≤3 people — solo project OK; player+remotion versions MUST match exactly
next                15.x (ssr:false only in Client Components — hard error in Server Components)
```
Sources: registry.npmjs.org (each pkg /latest), github.com/pmndrs/react-three-fiber/issues/3915, webflow.com/blog/gsap-becomes-free, remotion.dev/docs/terms, nextjs.org/blog/next-15

## Architecture (award-winner pattern → D-07)
- **One fixed full-screen WebGL canvas BEHIND the page**; HTML sections feed scroll progress into 3D scenes; result written back to native scroll (Oryzo, Awwwards SOTM Apr 2026 — rickcreates.com/r/2026-04-13-oryzo-ai; Shopify Renaissance, SOTM Feb 2026, 12 chapters ±1 mount window + hover-prefetch — awwwards.com/sites/the-renaissance-edition)
- Canvas must sit OUTSIDE the ScrollSmoother content wrapper: smoother transforms the wrapper via matrix3d; a transformed ancestor breaks position:fixed and pinning (gsap.com/docs/v3/Plugins/ScrollSmoother)
- data-speed/data-lag apply to DOM elements only, never the canvas host
- Scroll progress → useRef in ScrollTrigger onUpdate → read in useFrame; NEVER setState per frame (r3f.docs.pmnd.rs/advanced/pitfalls)
- Pin the container, tween three.js object properties inside the pin (stackoverflow.com/questions/78900977)
- One clock: drive any smooth-scroll from gsap.ticker; lagSmoothing(0); ScrollTrigger.update ≠ refresh

## 60fps mobile budgets (→ D-08)
- dpr default [1,2]; start 1.5, PerformanceMonitor onIncline→2 / onDecline→1 (drei.docs.pmnd.rs/performances/performance-monitor)
- Mobile target: <100 draw calls, <100k vertices (Don McCurdy, via utsubo.com/blog/threejs-best-practices-100-tips); R3F max 1000, optimal few hundred (pmndrs.github.io/react-three-fiber/advanced/scaling-performance)
- Draw calls dominate over triangles; instancing collapses particle fields to 1 draw call
- frameloop="demand" + invalidate() for at-rest scenes; watch sync-animation jump pitfall
- Ticker gating: gsap.ticker.add/remove via ScrollTrigger onEnter/onLeave — off-screen elements otherwise burn full-rate frames (gsapvault.com/blog/gsap-performance-guide)
- GLB <1MB: gltf-transform optimize (meshopt default under gzip/brotli; draco only for last-hundred-KB wins; textures first: webp, cap 1024–2048) (gltf-transform.dev/cli)
- Draco decoders CDN-load only for compressed models — prefetch them; KTX2 needs explicit wiring via useGLTF 4th arg

## Reduced motion / fallback (→ D-09)
- gsap.matchMedia(): full motion under "(prefers-reduced-motion: no-preference)", static under "reduce" — ScrollSmoother created ONLY under no-preference (gsap.com/resources/getting-started/accessibility; W3C WCAG22 C39)
- CSS cannot reach the WebGL loop — gate frameloop/Floats/pointer-easing in JS (rationalgo.ai)
- Fallback: three/addons WebGL.isWebGL2Available() probe + <Canvas fallback={<Poster/>}>; ALSO try/catch the renderer constructor; poster renders in server HTML and doubles as LCP element (threejs.org/manual/pages/webgl-compatibility-check.html; docs.pmnd.rs Canvas API)
- ScrollSmoother uses native scroll → fewer accessibility annoyances than scroll-hijackers; touch smoothing OFF by default (mobile-jank decision, keep it)

## LCP/INP (→ D-10)
- LCP ≤2.5s / INP ≤200ms / CLS ≤0.1, 75th percentile (web.dev/articles/lcp, /inp)
- Hero starts at opacity:0 = the most common animated-site LCP killer (jackyangmiao.com)
- dynamic(() => import(Scene), { ssr:false, loading: poster }) in a CLIENT component; canvas code-split; hero text paints from server HTML
- IntersectionObserver: stop rendering frames you can't see — biggest INP/battery win
- Test on mid-range Android + throttled connection, not a MacBook Lighthouse run

## Remotion (→ D-11)
- Fixed choreography, no user data → render once to mp4 h264, embed native <video> — zero JS on critical path; Player is for interactive/scrubbable, must be "use client", never on LCP path (remotion.dev/docs/player, /docs/performance)
- Chart animation: derive everything from useCurrentFrame(); spring stagger ~8 frames; counters with fontVariantNumeric tabular-nums (rendercomp.com/blog/data-visualization-animations-remotion-bar-charts-counters)
- Licensing: Free covers individuals + teams ≤3 (remotion.dev/docs/terms) — solo mission OK

## Award criteria (fact-check)
- No official WebGL bundle/FPS requirement exists; "60fps PRO" is a studio label. Awwwards: Design 40/Usability 30/Creativity 20/Content 10 + separate DEV rubric (awwwards.com/sites/the-renaissance-edition)
- Winner pattern (inference, labeled): one hard idea executed cleanly, not effect stacking

## Spline (weakest-sourced)
- ≤3 embeds/page, <spline-viewer> lazy-loads by default; no published FPS numbers (docs.spline.design). → D-12: at most ONE Spline embed, lazy, gated; art-director recommends procedural R3F hero instead
