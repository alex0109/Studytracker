import { FC, useId } from "react";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { Button, Separator } from "@/shared/radix-ui";
import { LayoutGroup, motion } from "framer-motion";
import type { switchInterfaceType } from "./switch-interface.type";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";

type SectionName = "Material" | "Questions" | "Attempts" | "Note" | "Words" | "Flashcards";

interface SwitchInterfaceProps {
  switchInterface: switchInterfaceType[];
}

export const SwitchInterface: FC<SwitchInterfaceProps> = ({
  switchInterface,
}) => {
  const { t } = useTranslation();
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  // The section is shared by materials, notes and dictionaries: one opened after another
  // may carry a section it doesn't have, and then its first tab is the one shown
  const current = switchInterface.some((item) => item.name === activeSection)
    ? activeSection
    : switchInterface[0]?.name;
  // Every tab bar slides its own underline
  const group = useId();

  return (
    <div className="flex flex-col w-full justify-center items-start my-3 sm:my-4">
      <LayoutGroup id={group}>
        <div className="flex w-full flex-nowrap items-stretch justify-center gap-1 px-1 sm:gap-5 sm:px-5">
          {switchInterface.map((item, index) => {
            const isActive = current === item.name;

            return (
              <motion.div
                key={item.key}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex min-w-0 flex-1 justify-center"
              >
                <Button
                  size="lg"
                  aria-pressed={isActive}
                  className={cn(
                    "relative w-full min-w-0 px-2 text-sm hover:bg-transparent has-[>svg]:px-2 sm:w-auto sm:px-3 sm:text-lg sm:has-[>svg]:px-3",
                    isActive
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
                  )}
                  variant="ghost"
                  onClick={() => {
                    setActiveSection(item.name);
                    setTimeOfLastClick(Date.now());
                  }}
                >
                  {item.icon}
                  <span className="truncate">
                    {t(`sections.${item.name as SectionName}`)}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      aria-hidden
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-current"
                      transition={{ type: "spring", stiffness: 480, damping: 36 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
      <Separator className="mt-2" />
    </div>
  );
};
