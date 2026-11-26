"use client";

// The fold. One client island owns the canvas probe, the reduced-motion branch
// and the driver refs; the three layers hang off it and are wired in one effect
// (initialise) with one cleanup (dispose).

import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { probeWebGL, usePrefs } from "../lib/motionPrefs";
import { OrbitalCanvas, useOrbitalDriver } from "./scene/OrbitalScene";
import { ScrollStory } from "./ScrollStory";
import { PosterSvg } from "./scene/PosterSvg";

type Mode = "poster" | "live" | "failed";

class CanvasBoundary extends Component<{ onError: () => void; children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  componentDidCatch() {
    // a renderer that passes the probe then dies on construction must land on the
    // poster, not on a React overlay — the poster is already painted underneath
    this.props.onError();
  }
  render() {
    return this.state.crashed ? null : this.props.children;
  }
}

export function HeroStage({ children }: { children: ReactNode }) {
  const driver = useOrbitalDriver();
  const { reduced } = usePrefs();
  const prefersReduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("poster");

  // reduced motion and a dead renderer share one path: the still SVG frame.
  // That drops the whole three/R3F chunk for those users and makes the failed
  // state assertable against the same markup the poster renders.
  useEffect(() => {
    if (prefersReduced) {
      setMode("failed");
      return;
    }
    setMode(probeWebGL() ? "live" : "failed");
  }, [prefersReduced]);

  // pointer parallax feeds the rig; passive, and only when motion is allowed
  useEffect(() => {
    if (mode !== "live") return;
    const onMove = (e: PointerEvent) => {
      driver.pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode, driver]);

  const fail = useCallback(() => setMode("failed"), []);

  return (
    <div className="stage-shell">
      <ScrollStory driver={driver} />

      <div className="hero__stage" data-canvas={mode} data-reduced={reduced}>
        <div className="hero__poster" aria-hidden="true">
          <PosterSvg />
        </div>
        {mode === "live" && (
          <div className="hero__canvas">
            <CanvasBoundary onError={fail}>
              <OrbitalCanvas driver={driver} />
            </CanvasBoundary>
          </div>
        )}

        {/* scan rails: pure CSS, sit over the canvas, GSAP drifts them */}
        <div className="hero__rails" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <motion.div className="hero__badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="hero__badge-dot" aria-hidden="true" />
          <span>drag / scroll</span>
        </motion.div>
      </div>

      {children}
    </div>
  );
}
