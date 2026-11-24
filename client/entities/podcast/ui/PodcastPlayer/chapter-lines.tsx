"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { IPodcastChapter } from "../../model";

// What is being said in the chapter, line by line with who says it
export const ChapterLines: FC<{ chapter: IPodcastChapter }> = ({ chapter }) => {
  const { t } = useTranslation();

  return (
    <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-2xl bg-neutral-50 p-3 text-sm dark:bg-neutral-950/50">
      {chapter.lines.map((line, index) => (
        <p key={index} className="flex gap-2">
          <span
            className={cn(
              "shrink-0 font-semibold",
              line.speaker === "Host" ? "text-violet-600 dark:text-violet-400" : "text-sky-600 dark:text-sky-400",
            )}
          >
            {line.speaker === "Host" ? t("podcast.player.host") : t("podcast.player.guest")}:
          </span>
          <span className="text-neutral-700 dark:text-neutral-300">{line.text}</span>
        </p>
      ))}
    </div>
  );
};
