"use client";

import { FC, useState } from "react";
import { LuArrowRight, LuClock, LuGraduationCap, LuLightbulb, LuPencilLine } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { ChoiceGroup, Modal } from "@/shared/ui";
import { cn } from "@/shared/lib";
import {
  ESSAY_EXAM_GROUPS,
  ESSAY_EXAMS,
  EXAM_TOPICS,
  EssayExam,
  EssayKind,
  EssayLevel,
  IEssayFormat,
} from "@/entities/note";

// General topics live in the locales and follow the interface; exam topics stay in the exam's language
const GENERAL_LEVELS = ["A2", "B1", "B2"] as const;
type GeneralLevel = (typeof GENERAL_LEVELS)[number];
// "general", or the language of a group of exams
type Source = string;
const LEVEL_ORDER: EssayLevel[] = ["A1", "A2", "B1", "B2"];
const groupOf = (exam: EssayExam) => ESSAY_EXAM_GROUPS.find((group) => group.exams.includes(exam))!;

interface EssayTopicsModalProps {
  open: boolean;
  onClose: () => void;
  // The format is null for a general topic
  onPick: (task: string, format: IEssayFormat | null) => void;
  // The exam of the essay now, so the window opens on it
  current: IEssayFormat | null;
}

export const EssayTopicsModal: FC<EssayTopicsModalProps> = ({ open, onClose, onPick, current }) => {
  const { t } = useTranslation();
  const [source, setSource] = useState<Source>(current ? groupOf(current.exam).language : "general");
  const [generalLevel, setGeneralLevel] = useState<GeneralLevel>("B1");
  // Levels are kept per language: in German a level also chooses the exam
  const [groupLevel, setGroupLevel] = useState<Partial<Record<string, EssayLevel>>>(
    current ? { [groupOf(current.exam).language]: current.level } : {},
  );
  const [examKind, setExamKind] = useState<Partial<Record<EssayExam, EssayKind>>>(
    current ? { [current.exam]: current.kind } : {},
  );

  const sources: { value: Source; label: string; sub: string }[] = [
    { value: "general", label: t("notes.essay.topicsGeneral"), sub: t("notes.essay.topicsGeneralSub") },
    ...ESSAY_EXAM_GROUPS.map((group) => ({
      value: group.language,
      label: group.language,
      sub: group.exams.map((exam) => ESSAY_EXAMS[exam].short).join(" · "),
    })),
  ];

  const renderList = (items: { title?: string; task: string }[], format: IEssayFormat | null) => (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={`${item.title ?? ""}-${index}`}>
          <button
            type="button"
            onClick={() => onPick(item.task, format)}
            className="group flex w-full items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 text-left transition hover:border-orange-300 hover:bg-orange-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:p-4 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-orange-800 dark:hover:bg-orange-950/30"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-semibold tabular-nums text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              {index + 1}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              {item.title && <span className="font-medium text-neutral-900 dark:text-neutral-50">{item.title}</span>}
              <span
                className={cn(
                  "whitespace-pre-line text-pretty text-sm leading-relaxed",
                  item.title ? "line-clamp-2 text-neutral-500 dark:text-neutral-400" : "text-neutral-800 dark:text-neutral-100",
                )}
              >
                {item.title ? item.task.split("\n")[0] : item.task}
              </span>
            </span>
            <LuArrowRight
              aria-hidden
              className="mt-1 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500"
            />
          </button>
        </li>
      ))}
    </ul>
  );

  const generalPanel = () => {
    const topics = t(`notes.essay.topics.${generalLevel}`, { returnObjects: true }) as string[];
    return (
      <>
        <ChoiceGroup
          label={t("notes.essay.topicLevel")}
          value={generalLevel}
          onChange={setGeneralLevel}
          options={GENERAL_LEVELS.map((value) => ({ value, label: value }))}
          hint={t(`notes.essay.topicLevels.${generalLevel}`)}
        />
        {renderList(topics.map((task) => ({ task })), null)}
      </>
    );
  };

  const examPanel = (language: string) => {
    const group = ESSAY_EXAM_GROUPS.find((item) => item.language === language) ?? ESSAY_EXAM_GROUPS[0];
    const levels = LEVEL_ORDER.filter((value) => group.exams.some((exam) => ESSAY_EXAMS[exam].levels.includes(value)));
    // B1 is the level most people take these exams for
    const picked = groupLevel[group.language];
    const level = picked && levels.includes(picked) ? picked : levels.includes("B1") ? "B1" : levels[0];
    const exam = group.exams.find((item) => ESSAY_EXAMS[item].levels.includes(level))!;
    const info = ESSAY_EXAMS[exam];
    const pickedKind = examKind[exam];
    const kind = pickedKind && info.kinds.includes(pickedKind) ? pickedKind : info.kinds[0];
    const facts = info.facts[kind];
    const minWords = facts.minWords(level);
    const topics = EXAM_TOPICS[exam][level]?.[kind] ?? [];

    return (
      <>
        <div className="flex flex-col gap-1.5 rounded-2xl bg-orange-50 p-4 text-sm dark:bg-orange-950/30">
          <p className="flex items-center gap-2 font-semibold text-orange-900 dark:text-orange-200">
            <LuGraduationCap aria-hidden />
            {info.name}
          </p>
          <p className="text-orange-900/80 dark:text-orange-200/80">{t(`notes.essay.exams.${exam}.about`)}</p>
          <p className="text-xs text-orange-900/60 dark:text-orange-200/60">{t("notes.essay.exams.notAffiliated")}</p>
        </div>

        <div className={cn("grid gap-3", info.kinds.length > 1 && "sm:grid-cols-2")}>
          <ChoiceGroup
            label={t("notes.essay.topicLevel")}
            value={level}
            onChange={(next) => setGroupLevel((prev) => ({ ...prev, [group.language]: next }))}
            options={levels.map((value) => ({ value, label: value }))}
          />
          {info.kinds.length > 1 && (
            <ChoiceGroup
              label={t("notes.essay.kind")}
              value={kind}
              onChange={(next) => setExamKind((prev) => ({ ...prev, [exam]: next }))}
              options={info.kinds.map((value) => ({ value, label: t(`notes.essay.kinds.${exam}.${value}`) }))}
            />
          )}
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <LuPencilLine aria-hidden className="text-orange-500" />
            {t(`notes.essay.kinds.${exam}.${kind}`)}
            {minWords && ` · ${t("notes.essay.minWords", { count: minWords })}`}
          </span>
          {facts.minutes && (
            <span className="flex items-center gap-1.5">
              <LuClock aria-hidden className="text-orange-500" />
              {t("notes.essay.minutes", { count: facts.minutes })}
            </span>
          )}
        </p>

        {renderList(topics, { exam, level, kind })}
      </>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      tone="warning"
      icon={<LuLightbulb />}
      title={t("notes.essay.topicsTitle")}
      description={t("notes.essay.topicsText")}
    >
      <div className="flex flex-col gap-4">
        <div role="tablist" aria-label={t("notes.essay.topicsSource")} className="grid grid-cols-2 gap-1.5 rounded-2xl bg-neutral-100 p-1.5 sm:grid-cols-4 dark:bg-neutral-800">
          {sources.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={source === item.value}
              onClick={() => setSource(item.value)}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-1.5 text-center transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300",
                source === item.value
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
              )}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className={cn("text-xs", source === item.value ? "text-orange-600 dark:text-orange-400" : "text-neutral-500")}>
                {item.sub}
              </span>
            </button>
          ))}
        </div>

        {source === "general" ? generalPanel() : examPanel(source)}
      </div>
    </Modal>
  );
};
