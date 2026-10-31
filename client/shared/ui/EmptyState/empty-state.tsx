// SHARED-UI

import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}

// The same friendly placeholder wherever a list is still empty
export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  text,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex w-full my-8 flex-col justify-center items-center gap-2 text-center",
      className,
    )}
  >
    <span className="flex size-12 items-center justify-center rounded-2xl bg-neutral-200 text-xl text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
      {icon}
    </span>
    <p className="font-medium text-neutral-800 dark:text-neutral-100">{title}</p>
    {text && (
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        {text}
      </p>
    )}
    {action}
  </div>
);
