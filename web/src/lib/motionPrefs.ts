"use client";

// One reader for the two media queries the whole page branches on.
// Kept out of components so the R3F scene, GSAP effects and motion overlays
// can never disagree about whether motion is allowed.

import { useEffect, useState } from "react";

export type Prefs = { reduced: boolean; coarse: boolean };

const REDUCED = "(prefers-reduced-motion: reduce)";
const COARSE = "(pointer: coarse)";

export function usePrefs(): Prefs {
  // SSR-safe: assume no-preference and fine pointer, then correct on mount.
  const [prefs, setPrefs] = useState<Prefs>({ reduced: false, coarse: false });

  useEffect(() => {
    const rm = window.matchMedia(REDUCED);
    const cm = window.matchMedia(COARSE);
    const sync = () => setPrefs({ reduced: rm.matches, coarse: cm.matches });
    sync();
    rm.addEventListener("change", sync);
    cm.addEventListener("change", sync);
    return () => {
      rm.removeEventListener("change", sync);
      cm.removeEventListener("change", sync);
    };
  }, []);

  return prefs;
}

export function probeWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
