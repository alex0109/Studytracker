"use client";

import { FC, useEffect, useRef } from "react";
import { Toast } from "radix-ui";
import {
  AnimatePresence,
  motion,
  animate,
  AnimationPlaybackControls,
} from "framer-motion";
import { useToasts } from "./useToast";
import { toastStore, ToastVariant } from "./toast.store";

const variantClasses: Record<ToastVariant, string> = {
  default: "bg-blue-600/50",
  success: "bg-green-400/50",
  error: "bg-red-500/50",
};

const barVariantClasses: Record<ToastVariant, string> = {
  default: "bg-blue-600",
  success: "bg-green-400",
  error: "bg-red-500",
};

const ProgressBar: FC<{ variant: ToastVariant; durationMs: number }> = ({
  variant,
  durationMs,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!barRef.current) return;
    controls.current = animate(
      barRef.current,
      { scaleX: [1, 0] },
      {
        duration: durationMs / 1000,
        ease: "linear",
      },
    );
    return () => controls.current?.stop();
  }, [durationMs]);

  return (
    <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl bg-black/10">
      <div
        ref={barRef}
        className={`h-full w-full origin-right ${barVariantClasses[variant]}`}
        onAnimationStart={() => {}}
        // expose pause/resume to parent via data attribute hooks below
      />
    </div>
  );
};

export const ToastProvider: FC = () => {
  const toasts = useToasts();

  return (
    <Toast.Provider swipeDirection="right">
      <AnimatePresence mode="popLayout">
        {toasts.map(
          ({
            id,
            title,
            description,
            variant = "default",
            durationMs = 4000,
          }) => (
            <Toast.Root
              key={id}
              asChild
              forceMount
              duration={durationMs}
              onOpenChange={(open) => {
                if (!open) toastStore.remove(id);
              }}
            >
              <motion.div
                layout
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`${variantClasses[variant]} relative z-50 overflow-hidden rounded-2xl shadow
                  p-4 grid grid-cols-[1fr_auto] gap-x-3 items-center`}
              >
                <div className="grid gap-1">
                  <Toast.Title className="font-medium text-sm text-black">
                    {title}
                  </Toast.Title>
                  {description && (
                    <Toast.Description className="text-sm text-black">
                      {description}
                    </Toast.Description>
                  )}
                </div>
                <Toast.Close
                  aria-label="Close"
                  className="text-black p-1 rounded-lg"
                >
                  <p>X</p>
                </Toast.Close>
                <ProgressBar variant={variant} durationMs={durationMs} />
              </motion.div>
            </Toast.Root>
          ),
        )}
      </AnimatePresence>
      <Toast.Viewport className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-6 w-full max-w-sm outline-none" />
    </Toast.Provider>
  );
};
