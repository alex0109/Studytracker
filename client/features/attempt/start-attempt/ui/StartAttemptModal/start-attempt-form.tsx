"use client";

import { FC, FormEvent, useState } from "react";
import { LuPlay } from "react-icons/lu";
import { EXAM_DIFFICULTIES, ExamDifficulty, IAssessment, IAssessmentSettings } from "@/entities/assessment";
import { Button } from "@/shared/radix-ui";
import { Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { DifficultyCounts, sumOf } from "../../lib/count-by-difficulty";
import { CUSTOM, isWholeInRange, useNumberSetting } from "../../hooks/useNumberSetting";
import { DifficultyToggles } from "./difficulty-toggles";
import { NumberChoice } from "./number-choice";

const COUNT_PRESETS = [10, 20, 30];
const MINUTE_PRESETS = [10, 20, 30, 60];
const MIN_COUNT = 1;
// The server's own ceiling
const MAX_COUNT = 1000;
const MIN_MINUTES = 1;
const MAX_MINUTES = 600;
const DEFAULT_CUSTOM_MINUTES = "45";

interface StartAttemptFormProps {
  saved: IAssessment;
  counts: DifficultyCounts;
  // Saving the choice and starting
  busy: boolean;
  onCancel: () => void;
  onSubmit: (settings: IAssessmentSettings) => void;
}

// Mounts with the dialog's content, so every opening starts from what was chosen last time
export const StartAttemptForm: FC<StartAttemptFormProps> = ({ saved, counts, busy, onCancel, onSubmit }) => {
  const { t } = useTranslation();

  const [difficulties, setDifficulties] = useState<ExamDifficulty[]>(
    saved.difficulties?.length ? saved.difficulties : [...EXAM_DIFFICULTIES],
  );
  const count = useNumberSetting(saved.questionCount ?? null, COUNT_PRESETS);
  const timer = useNumberSetting(saved.timerMinutes ?? null, MINUTE_PRESETS);

  const available = sumOf(counts, difficulties);
  const countValid = available > 0 && isWholeInRange(count.value, MIN_COUNT, Math.min(available, MAX_COUNT));
  const timerValid = isWholeInRange(timer.value, MIN_MINUTES, MAX_MINUTES);
  const questions = countValid ? Math.min(count.value ?? available, available) : undefined;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!countValid || !timerValid) return;

    onSubmit({ difficulties, questionCount: count.value, timerMinutes: timer.value });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <DifficultyToggles value={difficulties} onChange={setDifficulties} counts={counts} />
        {available === 0 && (
          <p role="alert" className="text-sm text-red-500">
            {t("exam.noQuestions")}
          </p>
        )}
      </div>

      <NumberChoice
        label={t("exam.questions")}
        noneLabel={t("exam.all", { count: available })}
        presets={COUNT_PRESETS}
        choice={count.choice}
        onChoice={(choice) => {
          count.setChoice(choice);
          if (choice === CUSTOM && !count.customText) count.setCustomText(String(available));
        }}
        customText={count.customText}
        onCustomText={count.setCustomText}
        min={MIN_COUNT}
        max={Math.max(available, MIN_COUNT)}
        unit={t("exam.ofTotal", { count: available })}
        available={available}
        error={
          available > 0 && !countValid ? t("exam.countRange", { min: MIN_COUNT, max: available }) : undefined
        }
      />

      <NumberChoice
        label={t("exam.timerMinutes")}
        noneLabel={t("exam.noTimer")}
        presets={MINUTE_PRESETS}
        choice={timer.choice}
        onChoice={(choice) => {
          timer.setChoice(choice);
          if (choice === CUSTOM && !timer.customText) timer.setCustomText(DEFAULT_CUSTOM_MINUTES);
        }}
        customText={timer.customText}
        onCustomText={timer.setCustomText}
        min={MIN_MINUTES}
        max={MAX_MINUTES}
        unit={t("exam.minutesUnit")}
        error={timerValid ? undefined : t("exam.minutesRange", { min: MIN_MINUTES, max: MAX_MINUTES })}
      />

      {/* Like the dialog's own footer: side by side from 400px, the main button last */}
      <div className="mt-1 flex flex-col-reverse gap-2 min-[400px]:flex-row min-[400px]:gap-3 min-[400px]:*:flex-1">
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={busy || questions === undefined || !timerValid}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {busy ? <Spinner /> : <LuPlay aria-hidden />}
          {questions === undefined ? t("exam.start") : t("exam.startWith", { count: questions })}
        </Button>
      </div>
    </form>
  );
};
