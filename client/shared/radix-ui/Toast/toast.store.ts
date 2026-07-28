export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

type Listener = () => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return toasts;
  },
  add(item: Omit<ToastItem, "id">) {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, durationMs: 4000, variant: "default", ...item }];
    emit();
    return id;
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};

export const toast = (item: Omit<ToastItem, "id">) => toastStore.add(item);
