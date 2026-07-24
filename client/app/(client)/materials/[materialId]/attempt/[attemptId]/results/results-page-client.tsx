"use client";

import { useAttemptResults } from "@/entities/attempt";
import { useQuestionAllReduced } from "@/entities/question";
import { BlockColumn, ContainerColumn, Title } from "@/shared/ui";
import { ResultsSummary, ResultQuestionList } from "@/widgets/Results";

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
    return null;
  }

  console.log("Q: ", questionsAllReducedData);

  return (
    <ContainerColumn>
      <BlockColumn>
        <Title text="RESULTS" />
      </BlockColumn>

      <BlockColumn>
        <ResultsSummary
          attempt={attemptResults}
          questionsLength={questionsAllReducedData.length}
        />
      </BlockColumn>

      <BlockColumn>
        <ResultQuestionList
          questions={questionsAllReducedData}
          results={attemptResults.results}
          materialId={materialId}
        />
      </BlockColumn>
    </ContainerColumn>
  );
};
