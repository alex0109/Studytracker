"use client";

import { useSyncExternalStore } from "react";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface ScreenInfo {
  width: number;

  breakpoint: Breakpoint | "xs";
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  isAbove: (bp: Breakpoint) => boolean;

  isBelow: (bp: Breakpoint) => boolean;
}

function getBreakpointName(width: number): Breakpoint | "xs" {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

function buildScreenInfo(width: number): ScreenInfo {
  return {
    width,
    breakpoint: getBreakpointName(width),
    isMobile: width < BREAKPOINTS.lg,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isAbove: (bp) => width >= BREAKPOINTS[bp],
    isBelow: (bp) => width < BREAKPOINTS[bp],
  };
}

const subscribeToResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

const windowWidth = () => window.innerWidth;

// The server knows no window: 0 there and while hydrating, the real width right after
const serverWidth = () => 0;

export function useScreenInfo(): ScreenInfo {
  const width = useSyncExternalStore(subscribeToResize, windowWidth, serverWidth);

  return buildScreenInfo(width);
}

export function useIsMobile(): boolean {
  return useScreenInfo().isMobile;
}
