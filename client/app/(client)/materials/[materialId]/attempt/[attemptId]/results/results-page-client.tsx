"use client";

import { useAttemptResults } from "@/entities/attempt";
import { useQuestionAllReduced } from "@/entities/question";
import { BlockColumn, Title } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";
import { ResultsSummary, ResultQuestionList } from "@/widgets/Results";
import { ExplainMistakesButton } from "@/features/attempt/explain-mistakes";

interface ResultsPageClientProps {
  materialId: string;
  attemptId: string;
}

export const ResultsPageClient = ({
  materialId,
  attemptId,
}: ResultsPageClientProps) => {
  const { attemptResults } = useAttemptResults(attemptId);

  const { questionsAllReducedData } = useQuestionAllReduced(materialId);

  if (!attemptResults || !questionsAllReducedData) {
    return (
      <BlockColumn blockStyles="gap-3">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </BlockColumn>
    );
  }

  return (
    <BlockColumn blockStyles="gap-4">
      <Title text="Results" blockStyles="my-1" />

      <ResultsSummary
        attempt={attemptResults}
        questionsLength={attemptResults.results.length}
      />

      <ExplainMistakesButton
        attemptId={attemptId}
        results={attemptResults.results}
      />

      <ResultQuestionList
        questions={questionsAllReducedData}
        results={attemptResults.results}
      />
    </BlockColumn>
  );
};
