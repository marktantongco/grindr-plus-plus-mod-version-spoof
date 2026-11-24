"use client";

// Scroll instrumentation: masthead border, orbital lock-on states, ScrollSmoother.
// ScrollSmoother is created only under no-preference (D-09/D-P4-7).

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export function ScrollEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const masthead = document.querySelector<HTMLElement>(".masthead");
    const segments = Array.from(
      document.querySelectorAll<HTMLElement>(".segment"),
    );

    const setScrolled = () => {
      if (!masthead) return;
      masthead.dataset.scrolled = String(window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    let smoother: ScrollSmoother | null = null;
    const ctx = gsap.context(() => {
      if (!reduced && !coarse) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 0.9,
          effects: false,
        });
      }

      if (reduced) {
        segments.forEach((s) => {
          s.dataset.state = "locked";
        });
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.set(el, { clearProps: "all" });
        });
        return;
      }

      segments.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: ".stage",
          start: () => `top+=${i * 32}% center`,
          end: () => `top+=${(i + 1) * 32}% center`,
          onEnter: () => {
            el.dataset.state = "locked";
          },
          onEnterBack: () => {
            el.dataset.state = "locked";
          },
          onLeave: () => {
            el.dataset.state = "passed";
          },
          onLeaveBack: () => {
            el.dataset.state = "dim";
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax || -12),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", setScrolled);
      ctx.revert();
      smoother?.kill();
    };
  }, []);

  return null;
}
