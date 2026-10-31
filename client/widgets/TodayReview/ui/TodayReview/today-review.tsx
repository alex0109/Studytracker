"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LuBookA, LuCircleCheckBig, LuClock, LuListChecks, LuPlay, LuSprout } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { FlashcardSessionModeEnum, IFlashcardSessionResponse } from "@/entities/flashcard";
import { IQuestionReviewSession, useReviewToday } from "@/entities/review";
import { FlashcardsDeck } from "@/features/dictionary/practice-dictionary";
import {
  QuestionReviewDeck,
  useQuestionReviewStart,
  useTodayWordsStart,
} from "@/features/review/today-review";

type Phase = "summary" | "words" | "questions" | "done";

const Fade: FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <motion.div
    key={id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.22 }}
    className="flex w-full flex-col items-center"
  >
    {children}
  </motion.div>
);

// Everything due today in one go: words from all dictionaries first, then questions from all materials
export const TodayReview: FC = () => {
  const { t } = useTranslation();
  const { todayData, todayIsPending, todayError } = useReviewToday();
  const [phase, setPhase] = useState<Phase>("summary");
  const [wordsSession, setWordsSession] = useState<IFlashcardSessionResponse>();
  const [questionSession, setQuestionSession] = useState<IQuestionReviewSession>();

  const { startWords, startWordsIsPending } = useTodayWordsStart();
  const { startQuestions, startQuestionsIsPending } = useQuestionReviewStart();

  const hasWords = (todayData?.wordsInSession ?? 0) > 0;
  const hasQuestions = (todayData?.questionsInSession ?? 0) > 0;
  const limitReached = todayData?.reviewsLeft === 0;

  const goQuestions = () =>
    startQuestions(undefined, {
      onSuccess: (session) => {
        setQuestionSession(session);
        setPhase("questions");
      },
      onError: () => setPhase("done"),
    });

  const goWords = (entryIds?: string[]) =>
    startWords(
      entryIds
        ? { mode: FlashcardSessionModeEnum.Custom, entryIds }
        : { mode: FlashcardSessionModeEnum.Due },
      {
        onSuccess: (session) => {
          setWordsSession(session);
          setPhase("words");
        },
      },
    );

  const start = () => (hasWords ? goWords() : goQuestions());

  if (todayIsPending) {
    return <Skeleton className="h-72 w-full max-w-2xl rounded-2xl" />;
  }

  if (todayError || !todayData) {
    return <p className="text-sm text-neutral-500">{t("today.error")}</p>;
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "summary" && (
        <Fade id="summary">
          {!hasWords && !hasQuestions ? (
            <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
              <motion.span
                initial={{ scale: 0.6, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                <LuSprout aria-hidden />
              </motion.span>
              {/* The daily maximum from the settings is reached: the rest waits for tomorrow */}
              {limitReached ? (
                <>
                  <h2 className="text-xl font-semibold">{t("today.limit.title")}</h2>
                  <p className="max-w-md text-sm text-neutral-500">{t("today.limit.text")}</p>
                  <Link href="/account#learning" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                    {t("today.limit.settings")} →
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{t("today.empty.title")}</h2>
                  <p className="max-w-md text-sm text-neutral-500">{t("today.empty.text")}</p>
                  <Link href="/materials" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                    {t("nav.materials")} →
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                  <span className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-300">
                    <LuBookA aria-hidden /> {t("today.startWords")}
                  </span>
                  <span className="text-3xl font-bold tabular-nums">{todayData.wordsInSession}</span>
                  {todayData.newWords > 0 && todayData.wordsInSession > todayData.dueWords && (
                    <span className="text-xs text-neutral-500">
                      {t("today.newWords", { count: todayData.wordsInSession - Math.min(todayData.dueWords, todayData.wordsInSession) })}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-sky-50 p-4 dark:bg-sky-950/40">
                  <span className="flex items-center gap-1.5 text-sm text-sky-700 dark:text-sky-300">
                    <LuListChecks aria-hidden /> {t("today.startQuestions")}
                  </span>
                  <span className="text-3xl font-bold tabular-nums">{todayData.questionsInSession}</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1 rounded-xl bg-neutral-100 p-4 sm:col-span-1 dark:bg-neutral-800">
                  <span className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                    <LuClock aria-hidden /> {t("today.title")}
                  </span>
                  <span className="text-3xl font-bold tabular-nums">
                    {t("today.minutes", { count: todayData.estimatedMinutes })}
                  </span>
                </div>
              </div>

              {!!todayData.dailyGoal && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700 dark:text-neutral-200">{t("today.goal.title")}</span>
                    <span className="tabular-nums text-neutral-500">
                      {t("today.goal.progress", { done: todayData.reviewsDone ?? 0, goal: todayData.dailyGoal })}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((todayData.reviewsDone ?? 0) / todayData.dailyGoal) * 100)}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
              )}

                            {todayData.overdueWords + todayData.overdueQuestions > 0 && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {t("today.overdue", { count: todayData.overdueWords + todayData.overdueQuestions })}
                </p>
              )}

              {(todayData.dictionaries.length > 0 || todayData.materials.length > 0) && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t("today.sources")}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {todayData.dictionaries.slice(0, 6).map((dictionary) => (
                      <span key={dictionary.dictionaryId} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                        {dictionary.title} · {dictionary.due + dictionary.new}
                      </span>
                    ))}
                    {todayData.materials.slice(0, 6).map((material) => (
                      <span key={material.materialId} className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
                        {material.title} · {material.due}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={start} disabled={startWordsIsPending || startQuestionsIsPending}>
                  <LuPlay aria-hidden /> {t("today.start")}
                </Button>
                {hasWords && hasQuestions && (
                  <Button size="lg" variant="outline" onClick={goQuestions} disabled={startQuestionsIsPending}>
                    {t("today.startQuestions")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Fade>
      )}

      {phase === "words" && wordsSession && (
        <Fade id={`words-${wordsSession.id}`}>
          <p className="mb-2 text-sm font-medium text-neutral-500">{t("today.phaseWords")}</p>
          <FlashcardsDeck
            key={wordsSession.id}
            session={wordsSession}
            isRepeatPending={startWordsIsPending}
            onRepeat={(entryIds) => goWords(entryIds)}
            onRestart={() => (hasQuestions ? goQuestions() : setPhase("done"))}
            continueLabel={hasQuestions ? t("today.startQuestions") : t("today.question.finish")}
          />
        </Fade>
      )}

      {phase === "questions" && questionSession && (
        <Fade id={`questions-${questionSession.id}`}>
          <p className="mb-2 text-sm font-medium text-neutral-500">{t("today.phaseQuestions")}</p>
          <QuestionReviewDeck session={questionSession} onDone={() => setPhase("done")} />
        </Fade>
      )}

      {phase === "done" && (
        <Fade id="done">
          <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center dark:bg-neutral-900">
            <motion.span
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12 }}
              className="text-5xl text-emerald-500"
            >
              <LuCircleCheckBig aria-hidden />
            </motion.span>
            <h2 className="text-xl font-semibold">{t("today.done.title")}</h2>
            <p className="max-w-md text-sm text-neutral-500">{t("today.done.text")}</p>
            <Button variant="outline" onClick={() => setPhase("summary")}>
              {t("today.done.back")}
            </Button>
          </div>
        </Fade>
      )}
    </AnimatePresence>
  );
};
