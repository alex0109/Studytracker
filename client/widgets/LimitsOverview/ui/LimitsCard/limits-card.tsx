import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

const TONES = {
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

interface LimitsCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  tone?: keyof typeof TONES;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const LimitsCard: FC<LimitsCardProps> = ({
  title,
  subtitle,
  icon,
  tone = "neutral",
  action,
  className,
  children,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-lg", TONES[tone])}>
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
