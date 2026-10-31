import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";

interface AccountSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  tone?: "default" | "danger";
  className?: string;
  children: ReactNode;
}

export const AccountSection: FC<AccountSectionProps> = ({
  id,
  title,
  subtitle,
  icon,
  tone = "default",
  className,
  children,
}) => (
  <section
    id={id}
    className={cn(
      "flex scroll-mt-28 flex-col gap-4 rounded-2xl border bg-white p-5 dark:bg-neutral-900",
      tone === "danger"
        ? "border-red-200 dark:border-red-900/60"
        : "border-neutral-200 dark:border-neutral-700",
      className,
    )}
  >
    <header className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
          tone === "danger"
            ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        )}
      >
        {icon}
      </span>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
    </header>
    {children}
  </section>
);
