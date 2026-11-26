"use client";

// Layer 2 of 3: GSAP owns scroll. It scrubs the hero camera rig (via the driver
// refs), pins the compare stage, and reveals copy. It never animates the same
// property Framer Motion animates (FM owns opacity/transform of the overlays; GSAP
// owns the scene + the section-scale reveals that FM does not touch).

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import type { SceneDriver } from "./scene/OrbitalScene";

const REDUCED = "(prefers-reduced-motion: reduce)";

export function ScrollStory({ driver }: { driver: SceneDriver }) {
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const masthead = document.querySelector<HTMLElement>(".masthead");
    const setScrolled = () => {
      if (masthead) masthead.dataset.scrolled = String(window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    let smoother: ScrollSmoother | null = null;
    const ctx = gsap.context(() => {
      if (reduced) {
        // static page: everything that would animate is already in its end state
        document.documentElement.dataset.motion = "off";
        document.querySelectorAll<HTMLElement>(".segment").forEach((s) => {
          s.dataset.state = "locked";
        });
        return;
      }
      document.documentElement.dataset.motion = "on";

      if (!coarse) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 0.9,
          effects: false,
        });
      }

      // hero: pin the PLATE and scrub the scene rig. The trigger is the plate, not
      // the copy: pinning a child of the trigger element leaves the copy sitting a
      // full fold below it, because ScrollTrigger pads the spacer instead of
      // pulling the following sibling up. Triggering on the plate means the copy,
      // which overlaps it by one fold in CSS, rides over the pinned frame.
      ScrollTrigger.create({
        trigger: ".hero__stage",
        start: "top top",
        end: "+=90%",
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          driver.progress.current = self.progress;
        },
        onLeave: () => {
          driver.progress.current = 1;
        },
        onLeaveBack: () => {
          driver.progress.current = 0;
        },
      });

      // compare: each tier locks as it reaches the centre band
      gsap.utils.toArray<HTMLElement>(".segment").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: ".stage",
          start: () => `top+=${i * 32}% center`,
          end: () => `top+=${(i + 1) * 32}% center`,
          onEnter: () => (el.dataset.state = "locked"),
          onEnterBack: () => (el.dataset.state = "locked"),
          onLeave: () => (el.dataset.state = "passed"),
          onLeaveBack: () => (el.dataset.state = "dim"),
        });
      });

      // depth: rule rails drift against the scroll, cheap transform only
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax || -10),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", setScrolled);
      ctx.revert();
      smoother?.kill();
    };
  }, [driver]);

  return null;
}
