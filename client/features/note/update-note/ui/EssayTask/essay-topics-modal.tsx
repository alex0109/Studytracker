"use client";

import { FC, useState } from "react";
import { LuLightbulb } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { ChoiceGroup, Modal } from "@/shared/ui";

// Ready topics by language level; the texts live in the locales, so they follow the interface
const LEVELS = ["A2", "B1", "B2"] as const;
type Level = (typeof LEVELS)[number];

interface EssayTopicsModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (topic: string) => void;
}

export const EssayTopicsModal: FC<EssayTopicsModalProps> = ({ open, onClose, onPick }) => {
  const { t } = useTranslation();
  const [level, setLevel] = useState<Level>("B1");
  const topics = t(`notes.essay.topics.${level}`, { returnObjects: true }) as string[];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      tone="ai"
      icon={<LuLightbulb />}
      title={t("notes.essay.topicsTitle")}
      description={t("notes.essay.topicsText")}
    >
      <div className="flex flex-col gap-4">
        <ChoiceGroup
          label={t("notes.essay.topicLevel")}
          value={level}
          onChange={setLevel}
          options={LEVELS.map((value) => ({ value, label: value }))}
          hint={t(`notes.essay.topicLevels.${level}`)}
        />
        <ul className="flex flex-col gap-2">
          {topics.map((topic, index) => (
            <li key={`${level}-${index}`}>
              <button
                type="button"
                onClick={() => onPick(topic)}
                className="flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-left text-sm leading-relaxed transition hover:border-violet-300 hover:bg-violet-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-violet-800 dark:hover:bg-violet-950/30"
              >
                <span className="mt-0.5 w-5 shrink-0 text-xs tabular-nums text-neutral-400">{index + 1}</span>
                <span className="text-neutral-800 text-pretty dark:text-neutral-100">{topic}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
