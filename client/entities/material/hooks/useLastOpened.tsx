"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "materialId";
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // Another tab opened a material
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

const readLastOpened = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

// Unknown on the server and while hydrating
const serverLastOpened = () => undefined;

export function useLastOpened() {
  const lastOpened = useSyncExternalStore(subscribe, readLastOpened, serverLastOpened);

  const saveLastOpenedId = (materialId: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(materialId));
    } catch {
      // Private mode or blocked storage: the hint is simply not remembered
    }
    listeners.forEach((notify) => notify());
  };

  return { lastOpened, saveLastOpenedId };
}
