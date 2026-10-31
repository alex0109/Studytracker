import { useSyncExternalStore } from "react";

const TICK_MS = 60_000;

let now = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (!timer) {
    // Nobody listened for a while, so the stored time may be old
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((notify) => notify());
    }, TICK_MS);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
};

const getSnapshot = () => now;

// The current time for rendering, shared by every component and refreshed once a minute,
// so "due now" badges change on their own. Date.now() in render would make output impure
export const useNow = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
