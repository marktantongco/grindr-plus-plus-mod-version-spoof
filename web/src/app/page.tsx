import { Shell } from "../components/Shell";
import { HeroStage } from "../components/HeroStage";
import { Measuring } from "../components/Measuring";
import { Rise, RiseItem, RiseList } from "../components/Stage";
import { features } from "../content/features";
import { lineage, meta } from "../content/credit";

export default function Page() {
  return (
    <Shell>
      {/* 1 — fold. Copy is server-painted; only the stage island is client. */}
      <HeroStage>
        <section className="section page hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="label">GPL-3.0 · fork of a fork · client-side only</p>
            <div className="hero__lead">
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
          </div>
        </section>
      </HeroStage>

      {/* 2 — stack */}
      <section className="section page stack" aria-labelledby="stack-title">
        <Rise>
          <p className="label">Built on</p>
          <h2 className="title" id="stack-title">
            Rails that don&rsquo;t move.
          </h2>
        </Rise>
        <RiseList className="stack__slabs">
          <RiseItem className="stack__slab" data-parallax="-8">
            <span>Next.js App Router</span>
            <small>one route, server-painted copy</small>
          </RiseItem>
          <RiseItem className="stack__slab" data-parallax="-8">
            <span>React Three Fiber + drei</span>
            <small>procedural geometry, no payload</small>
          </RiseItem>
          <RiseItem className="stack__slab" data-parallax="-8">
            <span>GSAP ScrollTrigger + Framer Motion</span>
            <small>one owns scroll, one owns the overlay</small>
          </RiseItem>
        </RiseList>
      </section>

      <div className="void" aria-hidden="true" />

      {/* 3 — compare, the pinned centrepiece (C-3, no-preset) */}
      <section className="section page stage" id="compare" aria-labelledby="compare-title">
        <div className="stage__sticky">
          <Rise>
            <p className="label">Three tiers, one device</p>
            <h2 className="title" id="compare-title">
              What everyone gets. What money buys. What the source gives.
            </h2>
          </Rise>
          <div>
            <RiseList className="stage__list">
              <RiseItem className="segment" data-state="dim">
                <p className="segment__term">Grindr, free</p>
                <p className="segment__body">
                  Ad-supported tier. Chat, browse, one album path, capped daily
                  boosts.
                </p>
                <p className="segment__state">baseline</p>
              </RiseItem>
              <RiseItem className="segment" data-state="dim">
                <p className="segment__term">Grindr Xtra</p>
                <p className="segment__body">
                  Paid tier as the mod projects describe it: more reach, more
                  visibility, fewer caps.
                </p>
                <p className="segment__state">subscription</p>
              </RiseItem>
              <RiseItem className="segment" data-state="dim">
                <p className="segment__term">grindr-plus-plus-mt</p>
                <p className="segment__body">
                  Spoofed build, rewritten experiment claims, five client-side
                  primitives, multi-clone. GPL-3.0.
                </p>
                <p className="segment__state">client-side</p>
              </RiseItem>
            </RiseList>
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
        <Rise>
          <p className="label">Measured, not claimed</p>
          <h2 className="title" id="perf-title">
            Numbers, not vibes.
          </h2>
        </Rise>
        <RiseList className="perf__grid">
          <RiseItem className="stat" data-parallax="-6">
            <p className="stat__def">chat open · composer painted</p>
            <p className="stat__value num">33 ms</p>
            <p className="stat__cond">
              8/8 samples · one 30 fps frame · N=8 of 18 tries
            </p>
          </RiseItem>
          <RiseItem className="stat" data-parallax="-6">
            <p className="stat__def">chat open · photo decoded</p>
            <p className="stat__value num">1.68 s</p>
            <p className="stat__cond">
              median of 4 samples · content settle, not the composer
            </p>
          </RiseItem>
          <RiseItem className="stat stat--measuring" data-parallax="-6">
            <p className="stat__def">profile open · official client</p>
            <p className="stat__value num">measuring</p>
            <Measuring />
          </RiseItem>
        </RiseList>
        <p className="perf__note">
          Captured on a physical device at 30 fps, latency read from the frame index.
          The composer paints in a single frame; the photo behind it keeps decoding,
          which is why the two are separate numbers. Profile-open and chat-close are
          still being captured.
        </p>
      </section>

      {/* 5 — features drawer (C-5) */}
      <section className="section page features" id="features" aria-labelledby="features-title">
        <Rise>
          <p className="label">Below the app, above the server</p>
          <h2 className="title" id="features-title">
            Eight primitives.
          </h2>
        </Rise>
        <RiseList className="features__track">
          {features.map((f) => (
            <RiseItem className="feature" key={f.name}>
              <h3 className="feature__name">{f.name}</h3>
              <p className="feature__body">{f.body}</p>
              <p className="feature__state">{f.state}</p>
            </RiseItem>
          ))}
        </RiseList>
      </section>

      {/* 6 — install (C-6, P-FN-07) */}
      <section className="section page install" id="install" aria-labelledby="install-title">
        <Rise>
          <p className="label">Five steps</p>
          <h2 className="title" id="install-title">
            Install it.
          </h2>
        </Rise>
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
