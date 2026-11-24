"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuCaptions, LuRefreshCw, LuSparkles } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { ConfirmModal, Spinner } from "@/shared/ui";
import { cn, formatPlayTime } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { AiFeatureEnum, AiUsageHint, getFeatureUsage, useAiUsage } from "@/entities/ai";
import { IDictionaryResponse } from "@/entities/dictionary";
import { useMaterialVideo } from "@/entities/video";
import { useVideoProcess } from "@/features/material/process-video";
import { GenerateQuestionsModal } from "@/features/question/generate-questions";
import { AddFromSelection } from "@/features/dictionary/add-from-selection";

// After the user scrolls the list, it stops following the video for a while
const FOLLOW_AGAIN_AFTER_MS = 4000;

interface VideoSubtitlesProps {
  materialId: string;
  // Current second of the player
  time: number;
  onSeek: (seconds: number) => void;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

export const VideoSubtitles: FC<VideoSubtitlesProps> = ({ materialId, time, onSeek, onOpenDictionary }) => {
  const { t } = useTranslation();
  const { videoData, videoIsPending } = useMaterialVideo(materialId);
  const { processVideo, processVideoIsPending } = useVideoProcess(materialId);
  const { aiUsageData } = useAiUsage(!videoData);
  const { isAvailable } = getFeatureUsage(aiUsageData, AiFeatureEnum.VideoTranscript);
  const [quizOpen, setQuizOpen] = useState(false);
  const [redoOpen, setRedoOpen] = useState(false);

  const listRef = useRef<HTMLOListElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const userScrolledAt = useRef(0);

  const segments = videoData?.segments ?? [];
  // The line being said: the last one that has started
  const active = segments.findLastIndex((segment) => segment.start <= time + 0.3);

  // The said line stays in view, a third from the top, unless the user is reading elsewhere
  useEffect(() => {
    const list = listRef.current;
    const line = list?.children[active] as HTMLElement | undefined;
    if (!list || !line || Date.now() - userScrolledAt.current < FOLLOW_AGAIN_AFTER_MS) return;
    list.scrollTo({ top: line.offsetTop - list.clientHeight / 3, behavior: "smooth" });
  }, [active]);

  const markUserScroll = () => {
    userScrolledAt.current = Date.now();
  };

  if (videoIsPending) {
    return (
      <div className="flex h-full flex-col gap-2 p-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 overflow-y-auto p-5 text-center">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600 dark:bg-red-950 dark:text-red-300">
          <LuCaptions aria-hidden />
        </span>
        <h3 className="text-base! font-semibold! text-neutral-900 dark:text-neutral-50">{t("video.empty.title")}</h3>
        <p className="max-w-sm text-sm text-pretty text-neutral-500 dark:text-neutral-400">{t("video.empty.text")}</p>
        {processVideoIsPending ? (
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
            <Spinner /> {t("video.processing")}
          </p>
        ) : (
          <Button onClick={() => processVideo()} disabled={!isAvailable} className="bg-red-600 text-white hover:bg-red-700">
            <LuSparkles aria-hidden /> {t("video.process")}
          </Button>
        )}
        <AiUsageHint feature={AiFeatureEnum.VideoTranscript} className="justify-center" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
        <h3 className="flex items-center gap-2 text-sm! font-semibold! text-neutral-800 dark:text-neutral-100">
          <LuCaptions aria-hidden className="text-red-600" /> {t("video.subtitles")}
        </h3>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setQuizOpen(true)} className="text-violet-700 dark:text-violet-300">
            <LuSparkles aria-hidden /> {t("video.quiz")}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRedoOpen(true)}
            disabled={processVideoIsPending}
            aria-label={t("video.redo")}
            title={t("video.redo")}
            className="size-8 text-neutral-500"
          >
            {processVideoIsPending ? <Spinner /> : <LuRefreshCw aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Words can be selected here and added to the material's dictionary, like in the text */}
      <div ref={textRef} className="min-h-0 flex-1">
        <ol
          ref={listRef}
          onWheel={markUserScroll}
          onTouchMove={markUserScroll}
          className="relative h-full overflow-y-auto overscroll-contain px-2 py-2 [scrollbar-width:thin]"
        >
          {segments.map((segment, index) => (
            <li
              key={`${segment.start}-${index}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "flex gap-3 rounded-lg px-2 py-1.5 transition-colors",
                index === active && "bg-red-50 dark:bg-red-950/30",
              )}
            >
              <button
                type="button"
                onClick={() => onSeek(segment.start)}
                title={t("video.momentTitle", { time: formatPlayTime(segment.start) })}
                className="shrink-0 pt-0.5 font-mono text-xs tabular-nums text-neutral-400 hover:text-red-600"
              >
                {formatPlayTime(segment.start)}
              </button>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  index === active ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-300",
                )}
              >
                {segment.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <p className="border-t border-neutral-200 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        {t("video.selectHint")}
        {videoData.isClipped && ` ${t("video.clipped")}`}
      </p>

      <AddFromSelection materialId={materialId} containerRef={textRef} onOpenDictionary={onOpenDictionary} />
      <GenerateQuestionsModal materialId={materialId} fromVideo open={quizOpen} setOpen={setQuizOpen} />
      <ConfirmModal
        open={redoOpen}
        onClose={() => setRedoOpen(false)}
        onConfirm={() => {
          setRedoOpen(false);
          processVideo();
        }}
        tone="ai"
        icon={<LuRefreshCw />}
        title={t("video.redoTitle")}
        description={t("video.redoText")}
        confirmText={t("video.redo")}
      />
    </div>
  );
};
