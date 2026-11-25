import { Shell } from "../components/Shell";
import { HeroCore } from "../components/HeroCore";
import { ScrollEffects } from "../components/ScrollEffects";
import { Measuring } from "../components/Measuring";
import { features } from "../content/features";
import { lineage, meta } from "../content/credit";

export default function Page() {
  return (
    <Shell>
      <ScrollEffects />

      {/* 1 — hero (P-FN-09) */}
      <section className="section page hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="label">GPL-3.0 · fork of a fork · client-side only</p>
          <h1 className="display" id="hero-title">
            The mod, measured.
          </h1>
          <p className="prose">
            An open-source client fork for Grindr: spoofed build, rewritten
            experiment claims, and five primitives that work below the app.
            Numbers where we have them, empty lamps where we do not.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#install">
              Get the build
            </a>
            <a href="#credit">Source on GitHub</a>
          </div>
          <p className="hero__meta">
            this fork&rsquo;s build 26.24.0 / 195444 — upstream marks 26.23.0+
            PairIP untested
          </p>
        </div>
        <HeroCore />
      </section>

      {/* 2 — stack */}
      <section className="section page stack" aria-labelledby="stack-title">
        <div data-reveal>
          <p className="label">Built on</p>
          <h2 className="title" id="stack-title">
            Rails that don&rsquo;t move.
          </h2>
        </div>
        <ul className="stack__slabs" data-parallax="-8">
          <li className="stack__slab">
            <span>Next.js App Router</span>
            <small>one route, server-painted copy</small>
          </li>
          <li className="stack__slab">
            <span>React Three Fiber + drei</span>
            <small>procedural geometry, no payload</small>
          </li>
          <li className="stack__slab">
            <span>GSAP ScrollSmoother + Remotion</span>
            <small>depth ordering, pre-rendered cut</small>
          </li>
        </ul>
      </section>

      <div className="void" aria-hidden="true" />

      {/* 3 — compare, the pinned centrepiece (C-3, no-preset) */}
      <section className="section page stage" id="compare" aria-labelledby="compare-title">
        <div className="stage__sticky">
          <div>
            <p className="label">Three tiers, one device</p>
            <h2 className="title" id="compare-title" data-reveal>
              What everyone gets. What money buys. What the source gives.
            </h2>
          </div>
          <div>
            <ol className="stage__list">
              <li className="segment" data-state="dim">
                <p className="segment__term">Grindr, free</p>
                <p className="segment__body">
                  Ad-supported tier. Chat, browse, one album path, capped daily
                  boosts.
                </p>
                <p className="segment__state">baseline</p>
              </li>
              <li className="segment" data-state="dim">
                <p className="segment__term">Grindr Xtra</p>
                <p className="segment__body">
                  Paid tier as the mod projects describe it: more reach, more
                  visibility, fewer caps.
                </p>
                <p className="segment__state">subscription</p>
              </li>
              <li className="segment" data-state="dim">
                <p className="segment__term">grindr-plus-plus-mt</p>
                <p className="segment__body">
                  Spoofed build, rewritten experiment claims, five client-side
                  primitives, multi-clone. GPL-3.0.
                </p>
                <p className="segment__state">client-side</p>
              </li>
            </ol>
            <p className="limits">
              <span className="limits__key">server-enforced, no client fix</span>
              <span>Viewed Me</span>
              <span>true incognito</span>
              <span>message-send entitlement</span>
              <span>age verification</span>
            </p>
          </div>
        </div>
      </section>

      {/* 4 — performance (C-4, P-PR-68) */}
      <section className="section page perf" id="performance" aria-labelledby="perf-title">
        <div data-reveal>
          <p className="label">Measured, not claimed</p>
          <h2 className="title" id="perf-title">
            Numbers, not vibes.
          </h2>
        </div>
        <div className="perf__grid">
          <div className="stat" data-parallax="-6">
            <p className="stat__def">chat open · composer painted</p>
            <p className="stat__value num">33 ms</p>
            <p className="stat__cond">
              8/8 samples · one 30 fps frame · N=8 of 18 tries
            </p>
          </div>
          <div className="stat" data-parallax="-6">
            <p className="stat__def">chat open · photo decoded</p>
            <p className="stat__value num">1.68 s</p>
            <p className="stat__cond">
              median of 4 samples · content settle, not the composer
            </p>
          </div>
          <div className="stat stat--measuring" data-parallax="-6">
            <p className="stat__def">profile open · official client</p>
            <p className="stat__value num">measuring</p>
            <Measuring />
          </div>
        </div>
        <p className="perf__note">
          Captured on a physical device at 30 fps, latency read from the frame index.
          The composer paints in a single frame; the photo behind it keeps decoding,
          which is why the two are separate numbers. Profile-open and chat-close are
          still being captured.
        </p>
      </section>

      {/* 5 — features drawer (C-5) */}
      <section className="section page features" id="features" aria-labelledby="features-title">
        <div data-reveal>
          <p className="label">Below the app, above the server</p>
          <h2 className="title" id="features-title">
            Eight primitives.
          </h2>
        </div>
        <ul className="features__track">
          {features.map((f) => (
            <li className="feature" key={f.name}>
              <h3 className="feature__name">{f.name}</h3>
              <p className="feature__body">{f.body}</p>
              <p className="feature__state">{f.state}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 — install (C-6, P-FN-07) */}
      <section className="section page install" id="install" aria-labelledby="install-title">
        <div data-reveal>
          <p className="label">Five steps</p>
          <h2 className="title" id="install-title">
            Install it.
          </h2>
        </div>
        <ol className="steps">
          <li className="step">
            <p className="step__head">
              <span className="step__n">01</span> Install the fork
            </p>
            <p className="step__body">Grab the signed build from releases.</p>
          </li>
          <li className="step">
            <p className="step__head">
              <span className="step__n">02</span> Uninstall the stock app
            </p>
            <p className="step__body">
              The signature differs; Android will refuse the install otherwise.
            </p>
          </li>
          <li className="step">
            <p className="step__head">
              <span className="step__n">03</span> Install and open
            </p>
            <p className="step__body">
              First launch writes the default config.
            </p>
          </li>
          <li className="step">
            <p className="step__head">
              <span className="step__n">04</span> Open the status dialog
            </p>
            <p className="step__body">
              Every skipped hook is listed there. Read it before reporting.
            </p>
          </li>
          <li className="step">
            <p className="step__head">
              <span className="step__n">05</span> Optional: arm a primitive
            </p>
            <p className="step__body">
              <a href="#credit">See the superpowers doc</a> for the config
              lines.
            </p>
          </li>
        </ol>
      </section>

      {/* 7 — credit (C-8, P-FN-10) */}
      <footer className="section page credit" id="credit">
        <div className="credit__brand">
          <p className="label">Credit</p>
          <h2 className="title">A fork, credited.</h2>
          <ul className="credit__lineage">
            {lineage.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="credit__licence">GPL-3.0, unchanged.</p>
        </div>
        <nav className="credit__links" aria-label="Sources">
          <a href="https://github.com/Guillerrmo/GrindrPlus">Upstream GrindrPlus</a>
          <a href="https://github.com/marktantongco/grindr-plus-plus-mt">
            This fork&rsquo;s source
          </a>
        </nav>
        <p className="meta">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
      </footer>
    </Shell>
  );
}
