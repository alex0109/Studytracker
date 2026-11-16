"use client";

import { FC, FormEvent, useState } from "react";
import { LuYoutube } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { getYouTubeId } from "@/entities/video";
import { useMaterialUpdate } from "@/features/material/update-material";

interface VideoLinkFormProps {
  materialId: string;
  link?: string;
  // Shown when a link is being changed, not added for the first time
  onCancel?: () => void;
  onSaved?: () => void;
}

// A video material without a YouTube link yet: the place to paste one
export const VideoLinkForm: FC<VideoLinkFormProps> = ({ materialId, link, onCancel, onSaved }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(link ?? "");
  const [invalid, setInvalid] = useState(false);
  const { updateMaterial, updateMaterialIsPending } = useMaterialUpdate(materialId);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const videoId = getYouTubeId(value);
    if (!videoId) {
      setInvalid(true);
      return;
    }
    // Saved in one plain form, whatever address was pasted
    updateMaterial(
      { id: materialId, dataToUpdate: { link: `https://www.youtube.com/watch?v=${videoId}` } },
      { onSuccess: () => onSaved?.() },
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-4 dark:border-red-900/60 dark:bg-red-950/20"
    >
      <label htmlFor={`video-link-${materialId}`} className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
        <LuYoutube aria-hidden className="text-lg text-red-600" />
        {t("video.linkLabel")}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`video-link-${materialId}`}
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setInvalid(false);
          }}
          placeholder="https://www.youtube.com/watch?v=…"
          aria-invalid={invalid}
          aria-describedby={`video-link-hint-${materialId}`}
          className="h-10 w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-3 sm:flex-1 text-sm outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-200/60 aria-invalid:border-red-500 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
          )}
          <Button type="submit" disabled={!value.trim() || updateMaterialIsPending} className="flex-1 sm:flex-none">
            {updateMaterialIsPending && <Spinner />}
            {t("common.save")}
          </Button>
        </div>
      </div>
      <p id={`video-link-hint-${materialId}`} className={invalid ? "text-xs text-red-600" : "text-xs text-neutral-500 dark:text-neutral-400"}>
        {invalid ? t("video.linkInvalid") : t("video.linkHint")}
      </p>
    </form>
  );
};
