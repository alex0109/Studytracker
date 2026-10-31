import { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

// The newest value for an effect that must not re-run when it changes,
// e.g. a callback prop that is a new function on every render
export const useLatest = <T>(value: T) => {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
};
