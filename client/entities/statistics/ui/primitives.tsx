"use client";

import { ReactNode, useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { fadeUp } from "../lib/motion";

type CardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Card({
  title,
  subtitle,
  action,
  className = "",
  children,
}: CardProps) {
  return (
    <motion.section
      variants={fadeUp}
      className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none ${className}`}
    >
      {(title || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </motion.section>
  );
}

export function CardSkeleton({ className = "h-52" }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      className={`animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    />
  );
}

export function CardEmpty({
  icon,
  text,
  className = "h-52",
}: {
  icon: ReactNode;
  text: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {icon}
      <p className="max-w-xs text-sm">{text}</p>
    </motion.div>
  );
}

export function TooltipShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 shadow-lg dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200">
      {children}
    </div>
  );
}

export function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString(),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, format);

  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduced, mv]);

  return <motion.span>{text}</motion.span>;
}
