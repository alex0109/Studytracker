"use client";

import { FC, useEffect, useRef } from "react";
import { Toast } from "radix-ui";
import {
  AnimatePresence,
  motion,
  animate,
  AnimationPlaybackControls,
} from "framer-motion";
import { LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useToasts } from "./useToast";
import { toastStore, ToastVariant } from "./toast.store";

// Neutral card, the variant shows in the border and the progress bar
const variantClasses: Record<ToastVariant, string> = {
  default: "border-neutral-200 dark:border-neutral-700",
  success: "border-emerald-300 dark:border-emerald-800",
  error: "border-red-300 dark:border-red-800",
};

const barVariantClasses: Record<ToastVariant, string> = {
  default: "bg-neutral-500",
  success: "bg-emerald-500",
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
    <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl bg-neutral-900/10 dark:bg-white/10">
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
  const { t } = useTranslation();
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
            action,
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
                className={`${variantClasses[variant]} relative z-50 overflow-hidden rounded-2xl border bg-white/95 shadow-lg backdrop-blur dark:bg-neutral-900/95
                  p-4 grid grid-cols-[1fr_auto] gap-x-3 items-center`}
              >
                <div className="grid gap-1">
                  <Toast.Title className="font-medium text-sm text-neutral-900 dark:text-neutral-50">
                    {title}
                  </Toast.Title>
                  {description && (
                    <Toast.Description className="text-sm text-neutral-600 dark:text-neutral-300">
                      {description}
                    </Toast.Description>
                  )}
                </div>
                {action && (
                  <Toast.Action
                    altText={action.label}
                    onClick={action.onClick}
                    className="col-start-1 mt-2 justify-self-start rounded-lg bg-neutral-900 px-3 py-1 text-xs font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
                  >
                    {action.label}
                  </Toast.Action>
                )}
                <Toast.Close
                  aria-label={t("common.close")}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 p-1 rounded-lg"
                >
                  <LuX aria-hidden />
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
