import { FC, ReactNode } from "react";
import { IconType } from "react-icons";
import { TruncatedText } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface SidebarLinkProps {
  icon?: IconType;
  label: string;
  isActive: boolean;
  onSelect: () => void;
  onPrefetch?: () => void;
  // Shown on the right, like a word count
  trailing?: ReactNode;
}

// A note or dictionary inside an opened material
export const SidebarLink: FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  isActive,
  onSelect,
  onPrefetch,
  trailing,
}) => (
  <button
    type="button"
    onClick={onSelect}
    onMouseEnter={onPrefetch}
    onFocus={onPrefetch}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "group/link flex h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors",
      "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60",
      isActive
        ? "bg-white font-medium text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
        : "text-neutral-600 hover:bg-neutral-900/5 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
    )}
  >
    {Icon && (
      <Icon
        aria-hidden
        className={cn(
          "shrink-0",
          isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover/link:text-neutral-600 dark:group-hover/link:text-neutral-300",
        )}
      />
    )}
    <TruncatedText text={label} className="flex-1" />
    {trailing}
  </button>
);
