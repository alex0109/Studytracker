// SHARED-UI
"use client";

import { FC, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
} as const;

const TONES = {
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  danger: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  ai: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  // A badge above the title: it says at a glance what kind of window this is
  icon?: ReactNode;
  tone?: keyof typeof TONES;
  // The action buttons. They share the row in equal parts, the main one goes last
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  children?: ReactNode;
}

// One frame for every dialog: centred header, scrolling body, equal buttons at the bottom.
// Radix keeps focus inside, closes on Escape and locks the page scroll behind it
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  icon,
  tone = "neutral",
  footer,
  size = "sm",
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          // Without a description Radix would point aria-describedby at nothing and warn
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-5",
            "rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xl shadow-neutral-950/10 outline-none",
            "dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40",
            "duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 motion-reduce:animate-none",
            SIZES[size],
          )}
        >
          <div className="flex flex-col items-center gap-1.5 px-6 text-center">
            {icon && (
              <span
                aria-hidden
                className={cn("mb-2 flex size-11 items-center justify-center rounded-2xl text-xl", TONES[tone])}
              >
                {icon}
              </span>
            )}
            <Dialog.Title className="text-lg font-semibold leading-snug text-balance text-neutral-900 dark:text-neutral-50">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="text-sm text-pretty text-neutral-500 dark:text-neutral-400">
                {description}
              </Dialog.Description>
            )}
          </div>

          {/* Padding inside the scroll area, so focus rings at its edges aren't cut off */}
          {children && <div className="-m-1 min-h-0 overflow-y-auto p-1">{children}</div>}

          {/* Side by side from 400px, on narrower phones stacked with the main button on top */}
          {footer && (
            <div className="flex flex-col-reverse gap-2 min-[400px]:flex-row min-[400px]:gap-3 min-[400px]:*:flex-1">
              {footer}
            </div>
          )}

          <Dialog.Close
            aria-label={t("common.close")}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:ring-neutral-600"
          >
            <LuX aria-hidden className="size-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
