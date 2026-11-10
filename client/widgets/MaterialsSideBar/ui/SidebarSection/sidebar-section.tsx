import { FC, ReactNode } from "react";

interface SidebarSectionProps {
  label: string;
  count?: number;
  // A small "add" button on the right of the label
  action?: ReactNode;
  children: ReactNode;
}

export const SidebarSection: FC<SidebarSectionProps> = ({ label, count, action, children }) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex h-7 items-center justify-between gap-2 pl-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-neutral-200/80 px-1.5 text-[10px] tabular-nums text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {count}
          </span>
        )}
      </span>
      {action}
    </div>
    {children}
  </div>
);
