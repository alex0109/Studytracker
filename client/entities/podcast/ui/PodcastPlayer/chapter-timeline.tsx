"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { formatPlayTime } from "@/shared/lib";
import { IPodcastChapter } from "../../model";

interface ChapterTimelineProps {
  chapters: IPodcastChapter[];
  time: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

// The timeline: one segment per chapter, filled as it plays. A hidden range input under it is the
// real control, for keyboards and screen readers
export const ChapterTimeline: FC<ChapterTimelineProps> = ({ chapters, time, duration, onSeek }) => {
  const { t } = useTranslation();
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 flex h-2 -translate-y-1/2 gap-0.5" aria-hidden>
          {chapters.map((item, index) => {
            const width = duration > 0 ? (item.durationSeconds / duration) * 100 : 100 / chapters.length;
            const filled =
              duration > 0 ? Math.min(1, Math.max(0, (time - item.startSeconds) / Math.max(item.durationSeconds, 0.01))) : 0;

            return (
              <div
                key={index}
                title={item.title}
                style={{ width: `${width}%` }}
                className="relative h-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 via-sky-500 to-violet-500"
                  style={{ width: `${filled * 100}%` }}
                />
              </div>
            );
          })}
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0.1)}
          step={1}
          value={time}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label={t("podcast.player.position")}
          aria-valuetext={`${formatPlayTime(time)} / ${formatPlayTime(duration)}`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-neutral-900 shadow dark:border-neutral-900 dark:bg-white"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-xs tabular-nums text-neutral-500">
        <span>{formatPlayTime(time)}</span>
        <span>{formatPlayTime(duration)}</span>
      </div>
    </div>
  );
};
