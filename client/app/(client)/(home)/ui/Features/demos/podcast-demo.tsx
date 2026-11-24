"use client";

import { FC, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuPause, LuPlay } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const LINES = ["host1", "guest1", "host2"] as const;
const CHAPTERS = ["intro", "main", "recap"] as const;

// A material becomes a talk of two voices, with chapters: press play and the lines go on
export const PodcastDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setLine((value) => (value + 1) % LINES.length), reduceMotion ? 3000 : 1800);
    return () => clearInterval(timer);
  }, [playing, reduceMotion]);

  return (
    <DemoPanel className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-label={t(playing ? "landing.features.demo.podcast.pause" : "landing.features.demo.podcast.play")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
        >
          {playing ? <LuPause aria-hidden /> : <LuPlay aria-hidden className="ml-0.5" />}
        </button>
        {/* A few bars that move while it plays */}
        <div aria-hidden className="flex h-8 flex-1 items-center gap-0.5">
          {Array.from({ length: 28 }, (_, index) => (
            <motion.span
              key={index}
              className="w-full rounded-full bg-violet-300 dark:bg-violet-700"
              animate={{ height: playing && !reduceMotion ? [`${20 + ((index * 37) % 60)}%`, `${80 - ((index * 23) % 50)}%`] : `${25 + ((index * 41) % 55)}%` }}
              transition={{ duration: 0.6, repeat: playing ? Infinity : 0, repeatType: "reverse", delay: (index % 5) * 0.06 }}
            />
          ))}
        </div>
      </div>
      <p className="min-h-10 text-sm">
        <span className={cn("mr-1.5 font-semibold", line === 1 ? "text-sky-600 dark:text-sky-400" : "text-violet-600 dark:text-violet-400")}>
          {t(line === 1 ? "landing.features.demo.podcast.guest" : "landing.features.demo.podcast.host")}:
        </span>
        {t(`landing.features.demo.podcast.${LINES[line]}`)}
      </p>
      <ol className="flex flex-wrap gap-1.5">
        {CHAPTERS.map((chapter, index) => (
          <li
            key={chapter}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              index === Math.min(line, CHAPTERS.length - 1)
                ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800",
            )}
          >
            {index + 1}. {t(`landing.features.demo.podcast.chapters.${chapter}`)}
          </li>
        ))}
      </ol>
    </DemoPanel>
  );
};
