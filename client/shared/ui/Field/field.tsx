// SHARED-UI
import { ComponentProps, FC, ReactNode } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/shared/lib/cn";

// One look for every text field, select and textarea in dialogs and forms
const control =
  "w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-3.5 text-[15px] text-neutral-900 outline-none transition " +
  "placeholder:text-neutral-400 hover:border-neutral-300 focus-visible:border-neutral-400 focus-visible:ring-4 focus-visible:ring-neutral-900/5 " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-400 aria-invalid:focus-visible:ring-red-500/10 " +
  "dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 " +
  "dark:hover:border-neutral-600 dark:focus-visible:border-neutral-500 dark:focus-visible:ring-white/5";

const labelText = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

interface FieldProps {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  // Right of the label, e.g. a character count
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

// The label wraps the control: it is tied to it without ids, and a tap on the text focuses it
export const Field: FC<FieldProps> = ({ label, required, hint, error, aside, className, children }) => (
  <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
    <span className="flex items-baseline justify-between gap-2">
      <span className={labelText}>
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </span>
      {aside && <span className="text-xs text-neutral-400">{aside}</span>}
    </span>
    {children}
    {error ? (
      <span role="alert" className="text-xs text-red-500">
        {error}
      </span>
    ) : (
      hint && <span className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>
    )}
  </label>
);

export const FieldInput = ({ className, ...props }: ComponentProps<"input">) => (
  <input className={cn(control, "h-10", className)} {...props} />
);

export const FieldTextArea = ({ className, ...props }: ComponentProps<"textarea">) => (
  <textarea className={cn(control, "min-h-24 resize-none py-2.5 leading-relaxed", className)} {...props} />
);

// The native list stays (phones show their own picker), only the arrow is drawn to match the fields
export const FieldSelect = ({ className, children, ...props }: ComponentProps<"select">) => (
  <span className="relative flex">
    <select
      className={cn(
        control,
        "h-10 cursor-pointer appearance-none pr-9 [&>option]:bg-white dark:[&>option]:bg-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <LuChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
    />
  </span>
);

interface ChoiceOption<T> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

interface ChoiceGroupProps<T> {
  label: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hint?: ReactNode;
  className?: string;
}

// A row of equal buttons for a short list of choices (a count, a type, true or false)
export const ChoiceGroup = <T extends string | number | boolean | null>({
  label,
  options,
  value,
  onChange,
  hint,
  className,
}: ChoiceGroupProps<T>) => (
  <div role="group" aria-label={label} className={cn("flex min-w-0 flex-col gap-1.5", className)}>
    <span aria-hidden className={labelText}>
      {label}
    </span>
    <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          aria-pressed={option.value === value}
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-sm font-medium transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-40",
            option.value === value
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-600 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
    {hint && <span className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>}
  </div>
);
