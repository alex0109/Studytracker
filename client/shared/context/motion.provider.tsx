"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

// Every animation follows the system setting: with "reduce motion" on, things fade
// instead of moving, sliding or springing
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
