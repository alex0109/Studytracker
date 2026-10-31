"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { IQuestionReduced } from "@/entities/question";
import { IResultResponse } from "@/entities/attempt";
import { Button } from "@/shared/radix-ui";
import { cn } from "@/shared/lib";
import { ResultQuestion } from "../ResultQuestion/result-question";
import { useTranslation } from "@/shared/i18n";

interface ResultsQuestionsProps {
  questions: IQuestionReduced[];
  results: IResultResponse[];
}

type Filter = "all" | "mistakes";

export const ResultQuestionList: FC<ResultsQuestionsProps> = ({
  questions,
  results,
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");

  // Questions of this attempt first, deleted later ones are not part of it
  const resultByQuestion = new Map(results.map((r) => [r.questionId, r]));
  const items = questions
    .map((question) => ({
      question,
      result: resultByQuestion.get(question.id),
    }))
    .filter((item) => item.result);
  const mistakes = items.filter((item) => !item.result!.isCorrect);
  const visible = filter === "mistakes" ? mistakes : items;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{t("results.answers")}</h3>
        <div className="inline-flex rounded-full bg-white p-1 dark:bg-neutral-900">
          {(
            [
              ["all", t("results.filter.all", { count: items.length })],
              ["mistakes", t("results.filter.mistakes", { count: mistakes.length })],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                filter === value
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-800",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-neutral-500">
          {filter === "mistakes" ? t("results.noMistakes") : t("results.noAnswers")}
        </p>
      ) : (
        visible.map(({ question, result }) => (
          <ResultQuestion
            key={question.id}
            index={
              items.findIndex((item) => item.question.id === question.id) + 1
            }
            title={question.title}
            questionType={question.questionType}
            options={question.options}
            result={result}
          />
        ))
      )}

      <div className="mt-2 flex w-full justify-center">
        <Link href="/materials">
          <Button size="lg" className="h-12 rounded-2xl">
            {t("results.goToMaterials")}
          </Button>
        </Link>
      </div>
    </div>
  );
};
