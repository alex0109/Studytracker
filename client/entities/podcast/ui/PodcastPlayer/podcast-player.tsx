"use client";

import { FC, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LuDownload,
  LuPause,
  LuPlay,
  LuRotateCcw,
  LuRotateCw,
  LuScrollText,
  LuSparkles,
  LuTriangleAlert,
} from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { IPodcast } from "../../model";
import { useMediaSession } from "./use-media-session";
import { ChapterTimeline } from "./chapter-timeline";
import { ChapterLines } from "./chapter-lines";
import { ChapterList } from "./chapter-list";

const SPEEDS = [1, 1.25, 1.5, 2, 0.75];
const SKIP_SECONDS = 15;

interface PodcastPlayerProps {
  podcast: IPodcast;
  title: string;
  // The link to the audio expired: ask for a new one
  onExpired?: () => void;
}

// One MP3 for the whole episode; chapters are places in it, so the timeline shows them as
// segments and the list jumps between them
export const PodcastPlayer: FC<PodcastPlayerProps> = ({ podcast, title, onExpired }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showText, setShowText] = useState(false);
  // The server knows the length; the file's own length covers an older answer without it
  const [fileDuration, setFileDuration] = useState(0);
  // The file didn't load: one fresh link is asked for by itself, then the user decides
  const [failed, setFailed] = useState(false);
  const askedForNewLink = useRef(false);

  const duration = podcast.durationSeconds || fileDuration;
  const chapters = podcast.chapters;
  const current = Math.max(0, chapters.findLastIndex((chapter) => chapter.startSeconds <= time + 0.05));
  const chapter = chapters[current];

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, seconds), duration || seconds);
    setTime(audio.currentTime);
  };

  // play() rejects when the file can't be loaded; that is shown, not thrown into the console
  const play = () => {
    audioRef.current
      ?.play()
      .then(() => setFailed(false))
      .catch(() => setFailed(true));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  };

  const playFrom = (seconds: number) => {
    seek(seconds);
    play();
  };

  const onLoadError = () => {
    // An expired link is the usual reason: one new link, never a loop of requests
    if (!askedForNewLink.current) {
      askedForNewLink.current = true;
      onExpired?.();
      return;
    }
    setFailed(true);
  };

  const tryAgain = () => {
    askedForNewLink.current = false;
    setFailed(false);
    onExpired?.();
  };

  useMediaSession(audioRef, chapter?.title ?? title, title, SKIP_SECONDS);

  const changeSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return (
    <div className="flex flex-col gap-5">
      <audio
        ref={audioRef}
        src={podcast.audioUrl ?? undefined}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = speed;
          if (Number.isFinite(event.currentTarget.duration)) setFileDuration(event.currentTarget.duration);
        }}
        onError={onLoadError}
      />

      {failed && (
        <p role="alert" className="flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <LuTriangleAlert aria-hidden className="shrink-0" />
          <span className="flex-1">{t("podcast.player.error")}</span>
          <button type="button" onClick={tryAgain} className="font-medium underline-offset-4 hover:underline">
            {t("podcast.retry")}
          </button>
        </p>
      )}

      {/* Now playing */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t("podcast.player.pause") : t("podcast.player.play")}
          className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xl text-white shadow-lg shadow-neutral-900/20 transition hover:scale-105 active:scale-95 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {playing && !reduceMotion && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-violet-500/30"
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
            />
          )}
          {playing ? <LuPause /> : <LuPlay className="ml-0.5" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            {t("podcast.player.chapter", { number: current + 1, total: chapters.length })}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="truncate font-semibold text-neutral-900 dark:text-neutral-50"
            >
              {chapter?.title}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <ChapterTimeline chapters={chapters} time={time} duration={duration} onSeek={seek} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => seek(time - SKIP_SECONDS)}
            aria-label={t("podcast.player.back", { seconds: SKIP_SECONDS })}
            className="relative flex size-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <LuRotateCcw className="size-5" />
            <span className="absolute text-[8px] font-bold">{SKIP_SECONDS}</span>
          </button>
          <button
            type="button"
            onClick={() => seek(time + SKIP_SECONDS)}
            aria-label={t("podcast.player.forward", { seconds: SKIP_SECONDS })}
            className="relative flex size-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <LuRotateCw className="size-5" />
            <span className="absolute text-[8px] font-bold">{SKIP_SECONDS}</span>
          </button>
          <button
            type="button"
            onClick={changeSpeed}
            aria-label={t("podcast.player.speed")}
            className="h-8 min-w-12 rounded-full border border-neutral-200 px-2 font-mono text-xs font-semibold tabular-nums text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
          >
            {speed}×
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowText((value) => !value)}
            aria-pressed={showText}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition",
              showText
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            )}
          >
            <LuScrollText aria-hidden /> {t("podcast.player.text")}
          </button>
          {podcast.audioUrl && (
            <a
              href={podcast.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              aria-label={t("podcast.player.download")}
              title={t("podcast.player.download")}
              className="flex size-8 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <LuDownload />
            </a>
          )}
        </div>
      </div>

      {/* What is being said, chapter by chapter */}
      <AnimatePresence initial={false}>
        {showText && chapter && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ChapterLines chapter={chapter} />
          </motion.div>
        )}
      </AnimatePresence>

      <ChapterList chapters={chapters} current={current} onPlay={playFrom} />

      <p className="flex items-center gap-1.5 text-xs text-neutral-400">
        <LuSparkles aria-hidden className="text-violet-500" /> {t("podcast.player.aiVoices")}
      </p>
    </div>
  );
};
