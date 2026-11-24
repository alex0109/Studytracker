"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { cn, formatPlayTime } from "@/shared/lib";
import { IPodcastChapter } from "../../model";

interface ChapterListProps {
  chapters: IPodcastChapter[];
  current: number;
  onPlay: (seconds: number) => void;
}

// The chapters in order: the material first, then its notes. A click plays from there
export const ChapterList: FC<ChapterListProps> = ({ chapters, current, onPlay }) => {
  const { t } = useTranslation();

  return (
    <ol className="flex flex-col gap-1">
      {chapters.map((item, index) => {
        const isCurrent = index === current;

        return (
          <li key={index}>
            <button
              type="button"
              onClick={() => onPlay(item.startSeconds)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                isCurrent
                  ? "bg-white font-medium text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-900/5 dark:text-neutral-300 dark:hover:bg-white/5",
              )}
            >
              <span className="w-5 shrink-0 font-mono text-xs text-neutral-400">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              {!item.noteId && (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:bg-neutral-800">
                  {t("podcast.player.material")}
                </span>
              )}
              <span className="shrink-0 font-mono text-xs tabular-nums text-neutral-400">{formatPlayTime(item.startSeconds)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};
