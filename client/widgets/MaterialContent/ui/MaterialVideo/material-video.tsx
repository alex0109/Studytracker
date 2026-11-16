"use client";

import { FC, useRef, useState } from "react";
import { LuPencil } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { MaterialTypeEnum } from "@/entities/material";
import { IDictionaryResponse } from "@/entities/dictionary";
import { getYouTubeId, IYouTubePlayerHandle, useVideoSeekRequests, YouTubePlayer } from "@/entities/video";
import { VideoLinkForm } from "./video-link-form";
import { VideoSubtitles } from "./video-subtitles";

interface MaterialVideoProps {
  materialId: string;
  title: string;
  type: MaterialTypeEnum;
  link?: string;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

// A material with a YouTube link plays the video with its subtitles beside it; a video material
// without one asks for the link. Other materials without a video show nothing
export const MaterialVideo: FC<MaterialVideoProps> = ({ materialId, title, type, link, onOpenDictionary }) => {
  const videoId = getYouTubeId(link);
  const [changingLink, setChangingLink] = useState(false);

  if (!videoId || changingLink) {
    if (!changingLink && type !== "video") return null;
    return (
      <VideoLinkForm
        materialId={materialId}
        link={link}
        onCancel={changingLink ? () => setChangingLink(false) : undefined}
        onSaved={() => setChangingLink(false)}
      />
    );
  }

  return (
    <VideoWithSubtitles
      key={videoId}
      materialId={materialId}
      title={title}
      videoId={videoId}
      onChangeLink={() => setChangingLink(true)}
      onOpenDictionary={onOpenDictionary}
    />
  );
};

interface VideoWithSubtitlesProps {
  materialId: string;
  title: string;
  videoId: string;
  onChangeLink: () => void;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

const VideoWithSubtitles: FC<VideoWithSubtitlesProps> = ({ materialId, title, videoId, onChangeLink, onOpenDictionary }) => {
  const { t } = useTranslation();
  const section = useRef<HTMLElement>(null);
  const player = useRef<IYouTubePlayerHandle>(null);
  const [time, setTime] = useState(0);

  // A question's moment plays from there, with the video brought into view
  useVideoSeekRequests(materialId, (seconds) => {
    section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    player.current?.seek(seconds);
  });

  return (
    <section ref={section} aria-label={t("video.title")} className="flex scroll-mt-28 flex-col gap-2">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <YouTubePlayer ref={player} videoId={videoId} title={t("video.playerTitle", { title })} onTime={setTime} />
        {/* Beside the player on wide screens, as tall as it; under it on narrow ones */}
        <div className="relative h-[22rem] min-h-0 xl:h-auto">
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <VideoSubtitles
              materialId={materialId}
              time={time}
              onSeek={(seconds) => player.current?.seek(seconds)}
              onOpenDictionary={onOpenDictionary}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onChangeLink}
        className="inline-flex items-center gap-1.5 self-start text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <LuPencil aria-hidden className="size-3" /> {t("video.changeLink")}
      </button>
    </section>
  );
};
