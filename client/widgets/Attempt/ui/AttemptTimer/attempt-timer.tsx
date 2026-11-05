"use client";

import { FC, useEffect, useRef, useState } from "react";
import { LuTimer } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

interface AttemptTimerProps {
  startedAt: Date | string;
  minutes: number;
  onExpired: () => void;
}

const format = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}` : `${minutes}:${rest}`;
};

// Counts from the attempt's start on the server, so a reload doesn't give the time back
export const AttemptTimer: FC<AttemptTimerProps> = ({ startedAt, minutes, onExpired }) => {
  const { t } = useTranslation();
  const endsAt = new Date(startedAt).getTime() + minutes * 60_000;
  const [now, setNow] = useState(() => Date.now());
  const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const expired = useRef(false);
  const latestOnExpired = useRef(onExpired);

  useEffect(() => {
    latestOnExpired.current = onExpired;
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft > 0 || expired.current) return;
    expired.current = true;
    latestOnExpired.current();
  }, [secondsLeft]);

  return (
    <span
      role="timer"
      aria-label={t("exam.timeLeft")}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-sm font-semibold tabular-nums",
        secondsLeft <= 60
          ? "animate-pulse bg-rose-100 text-rose-700 motion-reduce:animate-none dark:bg-rose-950 dark:text-rose-300"
          : secondsLeft <= 300
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
      )}
    >
      <LuTimer aria-hidden className="size-4" />
      {format(secondsLeft)}
    </span>
  );
};
