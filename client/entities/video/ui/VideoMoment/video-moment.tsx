"use client";

import { FC } from "react";
import { LuPlay } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { formatPlayTime } from "@/shared/lib/play-time";
import { seekMaterialVideo } from "../../lib";

interface VideoMomentProps {
  materialId: string;
  seconds: number;
  className?: string;
}

// "▶ 3:12" on a question: plays the material's video where the answer is said
export const VideoMoment: FC<VideoMomentProps> = ({ materialId, seconds, className }) => {
  const { t } = useTranslation();
  const time = formatPlayTime(seconds);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        seekMaterialVideo(materialId, seconds);
      }}
      title={t("video.momentTitle", { time })}
      aria-label={t("video.momentTitle", { time })}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium tabular-nums text-red-700 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950",
        className,
      )}
    >
      <LuPlay aria-hidden className="size-3" /> {time}
    </button>
  );
};
