"use client";

import { FC, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuHeadphones, LuRefreshCw, LuSparkles, LuTriangleAlert } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { EXPLANATION_LANGUAGES } from "@/entities/profile";
import { PodcastPlayer, usePodcast } from "@/entities/podcast";
import { GeneratePodcastModal, usePodcastGenerate } from "@/features/material/generate-podcast";

// Bars that move like a voice: while recording, and as the picture of an empty podcast
const Equalizer: FC<{ active: boolean }> = ({ active }) => {
  const reduceMotion = useReducedMotion();

  return (
    <span aria-hidden className="flex h-8 items-end gap-1">
      {[0.5, 0.9, 0.6, 1, 0.7, 0.4].map((height, index) => (
        <motion.span
          key={index}
          className="w-1.5 rounded-full bg-linear-to-t from-violet-500 to-sky-400"
          style={{ height: `${height * 100}%` }}
          animate={active && !reduceMotion ? { scaleY: [1, 0.35, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 0.9 + index * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
};

interface MaterialPodcastProps {
  materialId: string;
  title: string;
}

export const MaterialPodcast: FC<MaterialPodcastProps> = ({ materialId, title }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const { podcastData: podcast, podcastIsPending, refetchPodcast } = usePodcast(materialId);
  const { retryPodcast, retryPodcastIsPending } = usePodcastGenerate(materialId);

  const language = EXPLANATION_LANGUAGES.find((item) => item.code === podcast?.language)?.name;

  return (
    <section
      aria-label={t("podcast.title")}
      className="flex flex-col gap-4 rounded-3xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5 dark:border-violet-950 dark:bg-neutral-900"
    >
      <header className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <LuHeadphones aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-base! font-semibold! text-neutral-900 dark:text-neutral-50">{t("podcast.title")}</h3>
          {podcast && (
            <span className="truncate text-xs text-neutral-500">
              {language}
              {podcast.chapters.length > 0 && ` · ${t("podcast.chapters", { count: podcast.chapters.length })}`}
            </span>
          )}
        </div>
        {podcast && podcast.status !== "Generating" && (
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)} className="shrink-0 text-violet-700 dark:text-violet-300">
            <LuRefreshCw aria-hidden /> <span className="hidden sm:inline">{t("podcast.recreate")}</span>
          </Button>
        )}
      </header>

      {podcastIsPending ? (
        <Skeleton className="h-28 w-full rounded-2xl" />
      ) : !podcast ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-6 text-center dark:bg-neutral-950/40">
          <Equalizer active={false} />
          <p className="font-medium text-neutral-800 dark:text-neutral-100">{t("podcast.empty.title")}</p>
          <p className="max-w-md text-sm text-neutral-500 text-pretty dark:text-neutral-400">{t("podcast.empty.text")}</p>
          <Button className="mt-1 bg-violet-700 text-white hover:bg-violet-800" onClick={() => setModalOpen(true)}>
            <LuSparkles aria-hidden /> {t("podcast.create")}
          </Button>
        </div>
      ) : podcast.status === "Generating" ? (
        <div className="flex items-center gap-4 rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30" role="status">
          <Equalizer active />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-medium text-violet-900 dark:text-violet-200">
              {t("podcast.recording", { count: podcast.chapters.length })}
            </p>
            <p className="text-sm text-violet-800/80 dark:text-violet-300/80">{t("podcast.recordingHint")}</p>
          </div>
        </div>
      ) : podcast.status === "Failed" ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center dark:bg-amber-950/40 dark:text-amber-200">
          <LuTriangleAlert aria-hidden className="size-5 shrink-0" />
          <p className="flex-1">{t("podcast.failed")}</p>
          <Button variant="outline" onClick={() => retryPodcast()} disabled={retryPodcastIsPending}>
            {retryPodcastIsPending ? <Spinner /> : <LuRefreshCw aria-hidden />} {t("podcast.retry")}
          </Button>
        </div>
      ) : (
        <PodcastPlayer key={podcast.id + podcast.completedAt} podcast={podcast} title={title} onExpired={() => refetchPodcast()} />
      )}

      <GeneratePodcastModal
        materialId={materialId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        replaces={!!podcast}
      />
    </section>
  );
};
