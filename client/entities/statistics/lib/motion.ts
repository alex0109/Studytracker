"use client";

import { Variants, useReducedMotion } from "framer-motion";

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 22 },
  },
};

export function useChartAnimation() {
  return !useReducedMotion();
}
