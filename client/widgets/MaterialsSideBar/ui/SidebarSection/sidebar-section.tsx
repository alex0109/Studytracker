import { FC, ReactNode, useId } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/shared/lib";

interface SidebarSectionProps {
  label: string;
  count?: number;
  // A small "add" button on the right of the label
  action?: ReactNode;
  // With onToggleFold the label folds the group away, leaving only its name and count
  folded?: boolean;
  onToggleFold?: () => void;
  children: ReactNode;
}

const labelStyles =
  "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500";

export const SidebarSection: FC<SidebarSectionProps> = ({ label, count, action, folded = false, onToggleFold, children }) => {
  const contentId = useId();

  const name = (
    <>
      {label}
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-neutral-200/80 px-1.5 text-[10px] tabular-nums text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {count}
        </span>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex h-7 items-center justify-between gap-2 pl-2">
        {onToggleFold ? (
          <button
            type="button"
            onClick={onToggleFold}
            aria-expanded={!folded}
            aria-controls={contentId}
            className={cn(
              labelStyles,
              "-ml-1 rounded-md py-0.5 pl-1 pr-1.5 outline-none transition-colors hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:hover:text-neutral-200",
            )}
          >
            <LuChevronDown
              aria-hidden
              className={cn("size-3.5 transition-transform duration-200", folded && "-rotate-90")}
            />
            {name}
          </button>
        ) : (
          <span className={labelStyles}>{name}</span>
        )}
        {action}
      </div>
      <div id={contentId} className={cn("flex flex-col gap-0.5", folded && "hidden")}>
        {children}
      </div>
    </div>
  );
};
