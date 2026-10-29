"use client";

import { useCallback, useSyncExternalStore } from "react";

// Whether a media query matches. Unlike tracking window width, it re-renders only when
// the answer flips, not on every pixel of a resize. The server and the first render say no
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
