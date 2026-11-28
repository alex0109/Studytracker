import { useCallback, useSyncExternalStore } from "react";

// The groups under a material that can be folded
export type SidebarGroup = "notes" | "essays" | "dictionaries";

const KEY = "studytracker:materials-sidebar-folded";
const EVENT = "materials-sidebar-folded";

// Where storage is blocked the choice lives here until the page is closed
let memory = "";

// Kept as one string, so the snapshot stays the same until something is folded or unfolded
const readRaw = () => {
  try {
    return window.localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

// Which groups are folded, for every material at once: someone who hides dictionaries wants them hidden
// everywhere. Remembered in this browser
export const useFoldedSections = () => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const isFolded = useCallback((group: SidebarGroup) => raw.split(",").includes(group), [raw]);

  const toggle = useCallback((group: SidebarGroup) => {
    const current = new Set(readRaw().split(",").filter(Boolean));
    if (current.has(group)) current.delete(group);
    else current.add(group);
    memory = [...current].join(",");
    try {
      window.localStorage.setItem(KEY, memory);
    } catch {
      // Private mode: the choice lasts until the page is closed
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { isFolded, toggle };
};
