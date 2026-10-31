"use client";

import { FC, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { IQuestionReviewSession, IReviewAnswerResult } from "@/entities/review";
import { useQuestionReviewFinish } from "../../hooks/useTodayReview";
import { ReviewQuestionCard } from "../ReviewQuestionCard/review-question-card";

interface QuestionReviewDeckProps {
  session: IQuestionReviewSession;
  onDone: (results: IReviewAnswerResult[]) => void;
}

// Questions of the "Today" queue one after another; the session is closed after the last one
export const QuestionReviewDeck: FC<QuestionReviewDeckProps> = ({ session, onDone }) => {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<IReviewAnswerResult[]>([]);
  const { finishQuestions } = useQuestionReviewFinish();

  const total = session.questions.length;
  const question = session.questions[index];

  const onNext = (result: IReviewAnswerResult) => {
    const next = [...results, result];
    setResults(next);

    if (index + 1 >= total) {
      finishQuestions(session.id);
      onDone(next);
      return;
    }

    setIndex(index + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="h-1.5 w-full max-w-2xl overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${(results.length / total) * 100}%` }}
        />
      </div>
      <AnimatePresence mode="wait">
        {question && (
          <ReviewQuestionCard
            key={question.id}
            sessionId={session.id}
            question={question}
            index={index + 1}
            total={total}
            isLast={index + 1 >= total}
            onNext={onNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
