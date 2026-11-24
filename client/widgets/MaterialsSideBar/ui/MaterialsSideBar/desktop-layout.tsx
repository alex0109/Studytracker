"use client";

import { FC, ReactNode } from "react";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { AddMaterialModal } from "@/features/material/create-material";
import { useSidebarCollapsed } from "../../lib/use-sidebar-collapsed";

interface DesktopLayoutProps {
  // The list, given the button that folds it
  list: (collapseButton: ReactNode) => ReactNode;
  content: ReactNode;
  onCreated: (materialId: string) => void;
}

// The list beside the content; it folds to a narrow strip that keeps "add" at hand
export const DesktopLayout: FC<DesktopLayoutProps> = ({ list, content, onCreated }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  return (
    <div className="flex w-full min-w-0">
      {/* Stays in view while a long note scrolls; the list scrolls on its own */}
      <aside
        aria-label={t("nav.materials")}
        className={cn(
          "sticky top-28 self-start shrink-0 border-r border-neutral-200 transition-[width] duration-300 dark:border-neutral-800",
          collapsed ? "w-16" : "w-72 xl:w-80",
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              aria-label={t("materials.sidebar.expand")}
              title={t("materials.sidebar.expand")}
              className="rounded-xl"
            >
              <LuPanelLeftOpen />
            </Button>
            <AddMaterialModal variant="icon" onCreated={onCreated} />
          </div>
        ) : (
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin]">
            {list(
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(true)}
                aria-label={t("materials.sidebar.collapse")}
                title={t("materials.sidebar.collapse")}
                className="size-9 rounded-xl text-neutral-500"
              >
                <LuPanelLeftClose />
              </Button>,
            )}
          </div>
        )}
      </aside>
      <div className="flex min-w-0 flex-1 items-start justify-center">{content}</div>
    </div>
  );
};
