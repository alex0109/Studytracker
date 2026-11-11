"use client";

import { FC, useEffect, useRef, useState } from "react";
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
import { formatPlayTime } from "../../lib";

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

  // Lock screen and headphone buttons on phones
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: chapter?.title ?? title,
      artist: "Studytracker",
      album: title,
      artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
  }, [chapter?.title, title]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const audio = audioRef.current;
    const set = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Not every browser knows every action
      }
    };
    set("play", () => void audio?.play().catch(() => undefined));
    set("pause", () => audio?.pause());
    set("seekbackward", () => audio && (audio.currentTime = Math.max(0, audio.currentTime - SKIP_SECONDS)));
    set("seekforward", () => audio && (audio.currentTime = audio.currentTime + SKIP_SECONDS));
    return () => {
      (["play", "pause", "seekbackward", "seekforward"] as MediaSessionAction[]).forEach((action) => set(action, null));
    };
  }, []);

  const changeSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

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

      {/* Timeline: one segment per chapter */}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 flex h-2 -translate-y-1/2 gap-0.5" aria-hidden>
            {chapters.map((item, index) => {
              const width = duration > 0 ? (item.durationSeconds / duration) * 100 : 100 / chapters.length;
              const filled = duration > 0
                ? Math.min(1, Math.max(0, (time - item.startSeconds) / Math.max(item.durationSeconds, 0.01)))
                : 0;

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
          {/* The real control, for keyboards and screen readers */}
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={1}
            value={time}
            onChange={(event) => seek(Number(event.target.value))}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapters */}
      <ol className="flex flex-col gap-1">
        {chapters.map((item, index) => {
          const isCurrent = index === current;

          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => playFrom(item.startSeconds)}
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

      <p className="flex items-center gap-1.5 text-xs text-neutral-400">
        <LuSparkles aria-hidden className="text-violet-500" /> {t("podcast.player.aiVoices")}
      </p>
    </div>
  );
};
