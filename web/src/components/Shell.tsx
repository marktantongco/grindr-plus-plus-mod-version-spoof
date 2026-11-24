import type { ReactNode } from "react";
import { Mark } from "./Mark";

export function Masthead() {
  return (
    <header className="masthead" data-scrolled="false">
      <div className="masthead__inner">
        <a className="lockup" href="#main" aria-label="grindr-plus-plus-mt, skip to content">
          <Mark className="lockup__mark" />
          <span className="lockup__word">grindr-plus-plus-mt</span>
        </a>
        <span className="masthead__status">spoof 26.24.0</span>
        <nav className="masthead__nav" aria-label="Sections">
          <a href="#compare">Compare</a>
          <a href="#performance">Performance</a>
          <a href="#install">Install</a>
          <a href="#credit">Credit</a>
        </nav>
        <a className="btn btn--primary" href="#install">
          Get the build
        </a>
      </div>
    </header>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Masthead />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
