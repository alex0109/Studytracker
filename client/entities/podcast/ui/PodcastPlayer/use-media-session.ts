"use client";

import { RefObject, useEffect } from "react";

// Lock screen and headphone buttons on phones: what plays, and play, pause and skips
export const useMediaSession = (audioRef: RefObject<HTMLAudioElement | null>, title: string, album: string, skipSeconds: number) => {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "Studytracker",
      album,
      artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
  }, [title, album]);

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
    set("seekbackward", () => audio && (audio.currentTime = Math.max(0, audio.currentTime - skipSeconds)));
    set("seekforward", () => audio && (audio.currentTime = audio.currentTime + skipSeconds));
    return () => {
      (["play", "pause", "seekbackward", "seekforward"] as MediaSessionAction[]).forEach((action) => set(action, null));
    };
  }, [audioRef, skipSeconds]);
};
