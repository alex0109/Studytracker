"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuLightbulb, LuMapPin, LuRefreshCw, LuSparkles, LuTriangleAlert } from "react-icons/lu";
import { Modal, Spinner } from "@/shared/ui";
import { Button, Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { AiFeatureEnum, AiUsageHint, getFeatureUsage, useAiUsage } from "@/entities/ai";
import { EntryTerm, IDictionaryEntryResponse } from "@/entities/dictionary";
import { useWordExplanation } from "../../hooks/useWordExplanation";
import { HighlightTerm } from "./highlight-term";

interface ExplainWordModalProps {
  entry: IDictionaryEntryResponse;
  open: boolean;
  onClose: () => void;
}

export const ExplainWordModal: FC<ExplainWordModalProps> = ({ entry, open, onClose }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { explanation, explanationIsPending, explanationError, explainAgain } = useWordExplanation(entry.id, open);
  const { aiUsageData } = useAiUsage(open);
  const { isAvailable } = getFeatureUsage(aiUsageData, AiFeatureEnum.WordExplanation);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      tone="ai"
      icon={<LuSparkles />}
      title={<EntryTerm term={entry.term} article={entry.article} />}
      description={entry.translation}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
          <Button
            size="lg"
            className="bg-violet-700 text-white hover:bg-violet-800"
            disabled={explanationIsPending || !isAvailable}
            onClick={() => explainAgain()}
          >
            {explanationIsPending ? <Spinner /> : <LuRefreshCw aria-hidden />}
            {t("dictionary.explain.more")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5" aria-busy={explanationIsPending}>
        {explanationIsPending && !explanation ? (
          <div className="flex flex-col gap-3" role="status">
            <p className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
              <LuSparkles aria-hidden className="motion-safe:animate-pulse" /> {t("dictionary.explain.loading")}
            </p>
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : explanationError && !explanation ? (
          <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <LuTriangleAlert aria-hidden className="mt-0.5 shrink-0" /> {explanationError}
          </p>
        ) : explanation ? (
          <motion.div
            key={explanation.examples[0]?.sentence}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            <p className="text-pretty text-neutral-700 dark:text-neutral-300">{explanation.meaning}</p>

            <section className="flex flex-col gap-2">
              <h4 className="text-xs! font-semibold! uppercase tracking-wider text-neutral-400">
                {t("dictionary.explain.inLife")}
              </h4>
              <ul className="flex flex-col gap-2">
                {explanation.examples.map((example, index) => (
                  <motion.li
                    key={example.sentence}
                    initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="flex flex-col gap-1 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    {example.situation && (
                      <span className="inline-flex items-center gap-1 self-start rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-500 shadow-sm dark:bg-neutral-800 dark:text-neutral-400">
                        <LuMapPin aria-hidden className="size-3" /> {example.situation}
                      </span>
                    )}
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      <HighlightTerm sentence={example.sentence} term={entry.term} />
                    </p>
                    {example.translation && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{example.translation}</p>
                    )}
                  </motion.li>
                ))}
              </ul>
            </section>

            {explanation.collocations.length > 0 && (
              <section className="flex flex-col gap-2">
                <h4 className="text-xs! font-semibold! uppercase tracking-wider text-neutral-400">
                  {t("dictionary.explain.collocations")}
                </h4>
                <ul className="flex flex-wrap gap-1.5">
                  {explanation.collocations.map((item) => (
                    <li key={item} className="rounded-full border border-violet-200 px-2.5 py-1 text-sm text-violet-800 dark:border-violet-900 dark:text-violet-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {explanation.tip && (
              <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <LuLightbulb aria-hidden className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-semibold">{t("dictionary.explain.tip")}:</span> {explanation.tip}
                </span>
              </p>
            )}
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <AiUsageHint feature={AiFeatureEnum.WordExplanation} enabled={open} />
          <p className="text-xs text-neutral-400">{t("dictionary.explain.disclaimer")}</p>
        </div>
      </div>
    </Modal>
  );
};
