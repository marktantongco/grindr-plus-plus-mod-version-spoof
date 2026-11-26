"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { Mark } from "./Mark";

export function Masthead() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 160, damping: 28, restDelta: 0.001 });
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="masthead" data-scrolled={scrolled}>
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
        <a className="btn btn--primary masthead__cta" href="#install">
          Get the build
        </a>
      </div>
      <div className="masthead__progress" aria-hidden="true">
        <motion.span style={{ scaleX: reduced ? 1 : bar, transformOrigin: "0 50%" }} />
      </div>
    </header>
  );
}
