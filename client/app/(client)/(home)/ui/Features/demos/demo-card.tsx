import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

// The light inner panel every demo sits on
export const DemoPanel: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div
    className={cn(
      "rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60",
      className,
    )}
  >
    {children}
  </div>
);
