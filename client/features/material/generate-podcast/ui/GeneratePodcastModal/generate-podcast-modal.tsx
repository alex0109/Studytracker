"use client";

import { FC, useState } from "react";
import { LuHeadphones, LuMic, LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { FieldSelect, Modal, Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { AiFeatureEnum, AiUsageHint, getFeatureUsage, useAiUsage } from "@/entities/ai";
import { EXPLANATION_LANGUAGES } from "@/entities/profile";
import { usePodcastGenerate } from "../../hooks/usePodcastGenerate";

interface GeneratePodcastModalProps {
  materialId: string;
  open: boolean;
  onClose: () => void;
  // A podcast exists and will be replaced
  replaces: boolean;
}

// The language first: everything is spoken in it, whatever language the notes are in
export const GeneratePodcastModal: FC<GeneratePodcastModalProps> = ({ materialId, open, onClose, replaces }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    () => EXPLANATION_LANGUAGES.find((item) => item.code === i18n.language)?.code ?? "uk",
  );
  const { aiUsageData } = useAiUsage(open);
  const { isAvailable } = getFeatureUsage(aiUsageData, AiFeatureEnum.PodcastGeneration);
  const { generatePodcast, generatePodcastIsPending } = usePodcastGenerate(materialId);

  const start = async () => {
    try {
      await generatePodcast(language);
      onClose();
    } catch {
      // The hook already shows the reason
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !generatePodcastIsPending && onClose()}
      tone="ai"
      size="md"
      icon={<LuHeadphones />}
      title={t("podcast.modal.title")}
      description={t("podcast.modal.text")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={onClose} disabled={generatePodcastIsPending}>
            {t("common.cancel")}
          </Button>
          <Button
            size="lg"
            className="bg-violet-700 text-white hover:bg-violet-800"
            onClick={start}
            disabled={generatePodcastIsPending || !isAvailable}
          >
            {generatePodcastIsPending ? <Spinner /> : <LuSparkles aria-hidden />}
            {generatePodcastIsPending ? t("podcast.modal.writing") : t("podcast.modal.create")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{t("podcast.modal.language")}</span>
          <FieldSelect
            value={language}
            onValueChange={setLanguage}
            disabled={generatePodcastIsPending}
            aria-label={t("podcast.modal.language")}
            options={EXPLANATION_LANGUAGES.map((item) => ({ value: item.code, label: item.name, lang: item.code }))}
          />
        </label>

        <ul className="flex flex-col gap-2 rounded-2xl bg-neutral-50 p-3 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
          <li className="flex gap-2">
            <LuMic aria-hidden className="mt-0.5 shrink-0 text-violet-500" /> {t("podcast.modal.voices")}
          </li>
          <li className="flex gap-2">
            <LuHeadphones aria-hidden className="mt-0.5 shrink-0 text-violet-500" /> {t("podcast.modal.chapters")}
          </li>
        </ul>

        {replaces && (
          <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            {t("podcast.modal.replaces")}
          </p>
        )}

        <AiUsageHint feature={AiFeatureEnum.PodcastGeneration} enabled={open} />
      </div>
    </Modal>
  );
};
