import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

export const control =
  "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition-colors focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500";

export const Field: FC<{
  label: string;
  hint?: string;
  status: ReactNode;
  className?: string;
  children: ReactNode;
}> = ({ label, hint, status, className, children }) => (
  <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
    <span className="flex items-center justify-between gap-2 font-medium text-neutral-700 dark:text-neutral-200">
      {label}
      {status}
    </span>
    {children}
    {hint && <span className="text-xs text-neutral-500">{hint}</span>}
  </label>
);
