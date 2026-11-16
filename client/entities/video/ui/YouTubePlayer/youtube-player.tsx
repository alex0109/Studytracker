"use client";

import { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import { useLatest } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";

// The part of YouTube's IFrame Player API the page uses
interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  getIframe: () => HTMLIFrameElement;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: () => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
// How often the current second is passed on while the video plays
const TIME_TICK_MS = 250;

let api: Promise<YTNamespace> | null = null;

// The script is loaded once per page, only where a video is shown
const loadApi = (): Promise<YTNamespace> => {
  if (window.YT?.Player) return Promise.resolve(window.YT);

  api ??= new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      api = null;
      reject(new Error("The YouTube player did not load"));
    };
    document.head.appendChild(script);
  });

  return api;
};

export interface IYouTubePlayerHandle {
  // Plays from this second
  seek: (seconds: number) => void;
}

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  // The current second, a few times a second while playing
  onTime?: (seconds: number) => void;
  ref?: Ref<IYouTubePlayerHandle>;
}

// youtube-nocookie: YouTube keeps no cookies until the video is played
export const YouTubePlayer: FC<YouTubePlayerProps> = ({ videoId, title, onTime, ref }) => {
  const { t } = useTranslation();
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const ready = useRef(false);
  // A seek asked for before the player is ready happens once it is
  const pendingSeek = useRef<number | null>(null);
  const onTimeRef = useLatest(onTime);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    let cancelled = false;
    let ticker: ReturnType<typeof setInterval> | undefined;

    const play = (seconds: number) => {
      player.current?.seekTo(seconds, true);
      player.current?.playVideo();
      onTimeRef.current?.(seconds);
    };

    loadApi()
      .then((YT) => {
        if (cancelled) return;
        // The API replaces the element it is given, so it gets one of its own
        const mount = document.createElement("div");
        element.replaceChildren(mount);

        player.current = new YT.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId,
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
          events: {
            onReady: () => {
              ready.current = true;
              player.current?.getIframe().setAttribute("title", title);
              if (pendingSeek.current !== null) {
                play(pendingSeek.current);
                pendingSeek.current = null;
              }
            },
            onStateChange: ({ data }) => {
              clearInterval(ticker);
              if (data !== PLAYING) return;
              ticker = setInterval(() => onTimeRef.current?.(player.current?.getCurrentTime() ?? 0), TIME_TICK_MS);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      clearInterval(ticker);
      ready.current = false;
      player.current?.destroy();
      player.current = null;
      element.replaceChildren();
    };
    // The title only names the frame; a new one doesn't need a new player
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, onTimeRef]);

  useImperativeHandle(
    ref,
    () => ({
      seek: (seconds) => {
        if (!ready.current || !player.current) {
          pendingSeek.current = seconds;
          return;
        }
        player.current.seekTo(seconds, true);
        player.current.playVideo();
        onTimeRef.current?.(seconds);
      },
    }),
    [onTimeRef],
  );

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-950">
      {failed ? (
        // Blocked by an extension or offline: the video still opens on YouTube
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-neutral-200 hover:text-white"
        >
          <LuExternalLink aria-hidden className="text-2xl" />
          {t("video.openOnYouTube")}
        </a>
      ) : (
        <div ref={host} className="absolute inset-0 [&_iframe]:size-full" />
      )}
    </div>
  );
};
