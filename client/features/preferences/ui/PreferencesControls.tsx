"use client";

import { FC } from "react";
import { cn } from "@/shared/lib";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export const PreferencesControls: FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <LanguageSwitcher />
    <ThemeToggle />
  </div>
);
