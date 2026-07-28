import { useSyncExternalStore } from "react";
import { toastStore } from "./toast.store";

export const useToasts = () => {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );
};
