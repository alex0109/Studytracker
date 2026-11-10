import { useCallback, useSyncExternalStore } from "react";

const KEY = "studytracker:materials-sidebar-collapsed";
const EVENT = "materials-sidebar-collapsed";

const read = () => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
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

// Whether the list is folded to a rail on wide screens; remembered in this browser
export const useSidebarCollapsed = () => {
  const collapsed = useSyncExternalStore(subscribe, read, () => false);

  const setCollapsed = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      // Private mode: it works until the page is closed
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [collapsed, setCollapsed] as const;
};
