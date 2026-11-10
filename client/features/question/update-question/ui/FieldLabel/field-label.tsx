import { FC, ReactNode } from "react";

interface FieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  // Saving mark or a small action on the right of the label
  aside?: ReactNode;
}

export const FieldLabel: FC<FieldLabelProps> = ({ htmlFor, children, aside }) => (
  <div className="flex min-h-6 items-center justify-between gap-2">
    <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
      {children}
    </label>
    {aside}
  </div>
);

// One look for every text field of the editor
export const fieldClass =
  "field-sizing-content min-h-11 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[15px] leading-relaxed outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/50 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50";
