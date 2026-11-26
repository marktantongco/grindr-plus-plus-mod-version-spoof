"use client";

// Layer 3 of 3: Framer Motion owns every React overlay — the pin's copy blocks,
// the stat cards, the drawer. It animates opacity/transform of these DOM nodes
// only; the canvas under them is driven by GSAP, so the two never fight for the
// same object.

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

// Spring, damped enough that nothing overshoots more than ~4px. zeta 0.9 is the
// threshold below which the same spring reads as wobble on a phone.
const spring = { type: "spring", stiffness: 190, damping: 26, mass: 0.9 } as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: spring },
};

export const stagger = (each = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

export function Rise({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.35, margin: "0px 0px -12% 0px" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RiseList({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <ul className={className}>{children}</ul>;
  return (
    <motion.ul
      className={className}
      variants={stagger(0.055)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.ul>
  );
}

export function RiseItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <li className={className}>{children}</li>;
  return (
    <motion.li className={className} variants={riseIn}>
      {children}
    </motion.li>
  );
}
