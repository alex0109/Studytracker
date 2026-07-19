"use client";

import { useAttemptResults } from "@/entities/attempt";
import { useQuestionReduced } from "@/entities/question";
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

  const { questionsReducedData } = useQuestionReduced(materialId);

  if (!attemptResults || !questionsReducedData) {
    return null;
  }

  return (
    <ContainerColumn>
      <BlockColumn>
        <Title text="RESULTS" />
      </BlockColumn>

      <BlockColumn>
        <ResultsSummary
          attempt={attemptResults}
          questionsLength={questionsReducedData.length}
        />
      </BlockColumn>

      <BlockColumn>
        <ResultQuestionList
          questions={questionsReducedData}
          results={attemptResults.results}
        />
      </BlockColumn>
    </ContainerColumn>
  );
};
