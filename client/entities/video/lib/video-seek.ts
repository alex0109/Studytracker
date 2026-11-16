"use client";

import { useEffect } from "react";
import { useLatest } from "@/shared/hooks";

// A question's "3:12" plays the material's video from there: the player lives elsewhere on the
// page, so the request travels as a window event instead of through every component between
const EVENT = "studytracker:video-seek";

interface SeekDetail {
  materialId: string;
  seconds: number;
}

export const seekMaterialVideo = (materialId: string, seconds: number) => {
  window.dispatchEvent(new CustomEvent<SeekDetail>(EVENT, { detail: { materialId, seconds } }));
};

export const useVideoSeekRequests = (materialId: string, onSeek: (seconds: number) => void) => {
  const latest = useLatest(onSeek);

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<SeekDetail>).detail;
      if (detail?.materialId === materialId) latest.current(detail.seconds);
    };

    window.addEventListener(EVENT, listener);
    return () => window.removeEventListener(EVENT, listener);
  }, [materialId, latest]);
};
