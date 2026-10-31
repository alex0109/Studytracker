import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

interface DigestCardProps {
  icon: ReactNode;
  title: string;
  accent?: "emerald" | "orange" | "violet" | "neutral";
  className?: string;
  children: ReactNode;
}

const ACCENTS = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
};

export const DigestCard: FC<DigestCardProps> = ({
  icon,
  title,
  accent = "neutral",
  className,
  children,
}) => (
  <section
    className={cn(
      "flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none",
      className,
    )}
  >
    <header className="flex items-center gap-2">
      <span className={cn("flex size-8 items-center justify-center rounded-xl", ACCENTS[accent])}>
        {icon}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h3>
    </header>
    {children}
  </section>
);
