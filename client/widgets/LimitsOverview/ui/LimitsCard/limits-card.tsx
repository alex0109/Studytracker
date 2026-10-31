import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

interface LimitsCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const LimitsCard: FC<LimitsCardProps> = ({
  title,
  subtitle,
  icon,
  action,
  className,
  children,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            {icon}
          </span>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
};
