"use client";

import { FC, FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCheck, LuDownload, LuFileText, LuLink, LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { AiFeatureEnum, AiUsageHint } from "@/entities/ai";
import { useMaterialImport } from "../../hooks/useMaterialImport";

const STEPS = [
  { key: "fetch", icon: LuDownload },
  { key: "extract", icon: LuFileText },
  { key: "questions", icon: LuSparkles },
] as const;

interface ImportFromUrlProps {
  onImported: (materialId: string) => void;
}

// One request does all of it; the steps follow the usual timing, so the wait has a shape
export const ImportFromUrl: FC<ImportFromUrlProps> = ({ onImported }) => {
  const { t } = useTranslation();
  const ids = useId();
  const [url, setUrl] = useState("");
  const [generateQuestions, setGenerateQuestions] = useState(true);
  const [step, setStep] = useState(0);
  const { importMaterial, importMaterialIsPending } = useMaterialImport(onImported);

  const steps = generateQuestions ? STEPS : STEPS.slice(0, 2);
  // Outside an import the list rests on its first step
  const activeStep = importMaterialIsPending ? step : 0;

  useEffect(() => {
    if (!importMaterialIsPending) return;
    const toExtract = setTimeout(() => setStep(1), 1200);
    const toQuestions = setTimeout(() => setStep(2), 3500);
    return () => {
      clearTimeout(toExtract);
      clearTimeout(toQuestions);
    };
  }, [importMaterialIsPending]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = url.trim();
    if (!value) return;

    setStep(0);
    try {
      await importMaterial({
        // "example.com/story" is taken as an https address
        url: /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`,
        generateQuestions,
      });
      setUrl("");
    } catch {
      // The hook already said what went wrong
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4">
      <label htmlFor={`${ids}-url`} className="flex flex-col gap-1.5 text-sm font-medium">
        {t("materials.import.url")}
        <span className="relative">
          <LuLink aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400" />
          <input
            id={`${ids}-url`}
            type="text"
            inputMode="url"
            required
            autoComplete="off"
            value={url}
            disabled={importMaterialIsPending}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
            className="h-11 w-full rounded-2xl border border-neutral-200 bg-white pr-3 pl-9 text-sm font-normal outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </span>
        <span className="text-xs font-normal text-neutral-500">{t("materials.import.privateNote")}</span>
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={generateQuestions}
          disabled={importMaterialIsPending}
          onChange={(event) => setGenerateQuestions(event.target.checked)}
          className="mt-0.5 size-4 accent-emerald-600"
        />
        <span className="flex flex-col gap-0.5">
          {t("materials.import.generateQuestions")}
          <AiUsageHint feature={AiFeatureEnum.QuestionGeneration} />
        </span>
      </label>

      <AnimatePresence initial={false}>
        {importMaterialIsPending && (
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden"
            aria-live="polite"
          >
            {steps.map(({ key, icon: Icon }, index) => {
              const state = index < activeStep ? "done" : index === activeStep ? "active" : "waiting";
              return (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full transition-colors",
                      state === "done" && "bg-emerald-500 text-white",
                      state === "active" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                      state === "waiting" && "bg-neutral-100 text-neutral-400 dark:bg-neutral-800",
                    )}
                  >
                    {state === "done" ? (
                      <LuCheck aria-hidden />
                    ) : (
                      <Icon aria-hidden className={state === "active" ? "animate-pulse" : undefined} />
                    )}
                  </span>
                  <span className={state === "waiting" ? "text-neutral-400" : undefined}>
                    {t(`materials.import.steps.${key}`)}
                  </span>
                </li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>

      <Button size="lg" type="submit" disabled={importMaterialIsPending || !url.trim()} className="self-center">
        {importMaterialIsPending ? t("materials.import.pending") : t("materials.import.submit")}
      </Button>
    </form>
  );
};
