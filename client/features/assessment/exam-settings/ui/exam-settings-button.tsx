"use client";

import { FC, FormEvent, useState } from "react";
import { LuSlidersHorizontal, LuTimer } from "react-icons/lu";
import { useAssessment } from "@/entities/assessment";
import { Button } from "@/shared/radix-ui";
import { ChoiceGroup, Field, FieldInput, Modal, Spinner } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useExamSettings } from "../hooks/useExamSettings";

const FORM_ID = "exam-settings";
const PRESETS = [10, 20, 30, 45, 60];
const DEFAULT_MINUTES = 30;
const MIN_MINUTES = 1;
const MAX_MINUTES = 600;

// Mounts with the dialog's content, so every opening starts from what is saved
const ExamSettingsForm: FC<{ saved: number | null; onSave: (minutes: number | null) => void }> = ({ saved, onSave }) => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(saved !== null);
  const [minutes, setMinutes] = useState(String(saved ?? DEFAULT_MINUTES));

  const parsed = Number.parseInt(minutes, 10);
  const isValid = Number.isFinite(parsed) && parsed >= MIN_MINUTES && parsed <= MAX_MINUTES;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!enabled) onSave(null);
    else if (isValid) onSave(parsed);
  };

  return (
    <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((prev) => !prev)}
        className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 p-3 text-left transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
      >
        <LuTimer aria-hidden className="size-5 shrink-0 text-neutral-500" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">{t("exam.timer")}</span>
          <span className="text-xs text-neutral-500">{t("exam.timerHint")}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "relative h-6 w-10 shrink-0 rounded-full transition-colors",
            enabled ? "bg-emerald-600" : "bg-neutral-300 dark:bg-neutral-600",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none",
              enabled && "translate-x-4",
            )}
          />
        </span>
      </button>

      {enabled && (
        <>
          <ChoiceGroup
            label={t("exam.duration")}
            value={PRESETS.includes(parsed) ? parsed : null}
            onChange={(value) => value !== null && setMinutes(String(value))}
            options={PRESETS.map((value) => ({ value, label: value }))}
          />
          <Field
            label={t("exam.customMinutes")}
            error={isValid ? undefined : t("exam.minutesRange", { min: MIN_MINUTES, max: MAX_MINUTES })}
          >
            <FieldInput
              type="number"
              inputMode="numeric"
              min={MIN_MINUTES}
              max={MAX_MINUTES}
              value={minutes}
              aria-invalid={!isValid}
              onChange={(event) => setMinutes(event.target.value)}
            />
          </Field>
        </>
      )}
    </form>
  );
};

// Chosen or changed before the attempt starts; a running attempt keeps the time it started with
export const ExamSettingsButton: FC<{ assessmentId: string }> = ({ assessmentId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { assessment } = useAssessment(assessmentId);
  const { saveExamSettings, saveExamSettingsIsPending } = useExamSettings(assessmentId);
  const timer = assessment?.timerMinutes ?? null;

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-neutral-600 dark:text-neutral-300">
        <LuSlidersHorizontal aria-hidden />
        {t("exam.settings")}
        {timer !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
            <LuTimer aria-hidden className="size-3" />
            {t("exam.minutes", { count: timer })}
          </span>
        )}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<LuSlidersHorizontal />}
        title={t("exam.settings")}
        description={t("exam.settingsText")}
        footer={
          <>
            <Button size="lg" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button size="lg" type="submit" form={FORM_ID} disabled={saveExamSettingsIsPending}>
              {saveExamSettingsIsPending && <Spinner />}
              {t("common.save")}
            </Button>
          </>
        }
      >
        <ExamSettingsForm
          saved={timer}
          onSave={(minutes) => saveExamSettings(minutes, { onSuccess: () => setOpen(false) })}
        />
      </Modal>
    </>
  );
};
