"use client";

import { FC } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

// 1 change: slight doubt, 2: clear, 3 or more: strong. The server counts the same way
const LEVELS = ["slight", "clear", "strong"] as const;

// Grey and small on purpose: a quiet note that changing the answer is taken into account, not a
// warning. Only the tooltip says what it means
export const HesitationMark: FC<{ changes: number }> = ({ changes }) => {
  const { t } = useTranslation();
  if (changes <= 0) return null;

  const level = LEVELS[Math.min(changes, LEVELS.length) - 1];

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger
        type="button"
        aria-label={t("attempt.hesitation.label")}
        className="shrink-0 rounded-full text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <LuCircleAlert aria-hidden className="size-4" />
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="max-w-64 text-left">
        {t("attempt.hesitation.changed", { count: changes })} {t(`attempt.hesitation.${level}`)}
      </TooltipContent>
    </Tooltip>
  );
};
