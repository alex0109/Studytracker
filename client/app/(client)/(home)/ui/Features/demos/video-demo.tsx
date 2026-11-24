"use client";

import { FC, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { LuBookA, LuCircleHelp, LuPlay } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { DemoPanel } from "./demo-card";

const LINES = [
  { time: "0:04", key: "line1" },
  { time: "0:11", key: "line2" },
  { time: "0:19", key: "line3" },
] as const;

// A YouTube link gets subtitles that follow the video, a quiz with moments and words for the dictionary
export const VideoDemo: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % LINES.length), 1700);
    return () => clearInterval(timer);
  }, [isInView, reduceMotion]);

  return (
    <div ref={ref}>
      <DemoPanel className="flex flex-col gap-3">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950">
          <span className="flex size-11 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <LuPlay aria-hidden className="ml-0.5" />
          </span>
          <span className="absolute inset-x-3 bottom-2 rounded-md bg-black/60 px-2 py-1 text-center text-xs text-white">
            {t(`landing.features.demo.video.${LINES[active].key}`)}
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {LINES.map((line, index) => (
            <li
              key={line.key}
              className={cn(
                "flex gap-2 rounded-lg px-2 py-1 text-xs transition-colors",
                index === active ? "bg-emerald-50 text-neutral-900 dark:bg-emerald-950/50 dark:text-neutral-100" : "text-neutral-500",
              )}
            >
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{line.time}</span>
              {t(`landing.features.demo.video.${line.key}`)}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          <span className="flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <LuCircleHelp aria-hidden /> {t("landing.features.demo.video.quiz")}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <LuBookA aria-hidden /> {t("landing.features.demo.video.words")}
          </span>
        </div>
      </DemoPanel>
    </div>
  );
};
