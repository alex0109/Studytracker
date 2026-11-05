// SHARED-UI
"use client";

import { ReactNode } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { cn } from "@/shared/lib/cn";
import { fieldControl } from "./field";

// Radix keeps "" for "nothing chosen", so an option that means "none" travels under this name
const NONE = "__none";

export interface SelectOption {
  value: string;
  label: ReactNode;
  // Language options carry their own lang, so screen readers say them right
  lang?: string;
}

interface SelectMenuProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  "aria-label"?: string;
  // The look of the closed select; the menu is the same everywhere
  triggerClassName: string;
  // In place of the arrow, e.g. a saving spinner
  icon?: ReactNode;
}

// The menu of every select looks like the language menu: a floating card with a check on the
// chosen line. The native list looked different in every browser and system
export const SelectMenu = ({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  invalid,
  "aria-label": ariaLabel,
  triggerClassName,
  icon,
}: SelectMenuProps) => (
  <SelectPrimitive.Root
    value={value === "" ? NONE : value}
    onValueChange={(next) => onValueChange(next === NONE ? "" : next)}
    disabled={disabled}
  >
    <SelectPrimitive.Trigger
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className={cn("group flex cursor-pointer items-center justify-between gap-2 text-left", triggerClassName)}
    >
      <span className="min-w-0 truncate">
        <SelectPrimitive.Value placeholder={placeholder} />
      </span>
      {icon ?? (
        <SelectPrimitive.Icon asChild>
          <LuChevronDown
            aria-hidden
            className="size-4 shrink-0 opacity-60 transition-transform group-data-[state=open]:rotate-180"
          />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>

    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          menuSurface,
          "min-w-(--radix-select-trigger-width) max-w-[min(24rem,calc(100vw-2rem))] max-h-[min(20rem,var(--radix-select-content-available-height))]",
        )}
      >
        <SelectPrimitive.Viewport className="p-1">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option.value || NONE}
              value={option.value || NONE}
              lang={option.lang}
              className={menuItem}
            >
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="ml-auto shrink-0 pl-2">
                <LuCheck aria-hidden className="size-4" />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
);

type FieldSelectProps = Omit<SelectMenuProps, "triggerClassName" | "icon"> & { className?: string };

// A select among the fields of a form, sized and outlined like them
export const FieldSelect = ({ className, ...props }: FieldSelectProps) => (
  <SelectMenu
    {...props}
    triggerClassName={cn(fieldControl, "h-10 data-placeholder:text-neutral-400", className)}
  />
);

// Shared with the dropdown menus, so every floating list on the site is one family
export const menuSurface =
  "z-50 overflow-hidden overflow-y-auto rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-lg shadow-neutral-950/5 " +
  "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/40 " +
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 " +
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95";

export const menuItem =
  "relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none " +
  "data-highlighted:bg-neutral-100 data-[state=checked]:font-medium data-disabled:pointer-events-none data-disabled:opacity-50 " +
  "dark:data-highlighted:bg-neutral-800";
