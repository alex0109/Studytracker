"use client";

import { useEffect, useState, useCallback } from "react";

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

export function useScreenInfo(): ScreenInfo {
  const [width, setWidth] = useState(0);

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return buildScreenInfo(width);
}

export function useIsMobile(): boolean {
  return useScreenInfo().isMobile;
}
