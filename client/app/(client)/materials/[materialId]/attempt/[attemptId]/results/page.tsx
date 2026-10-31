import { ResultsPageClient } from "./results-page-client";

const ResultsPage = async ({
  params,
}: {
  params: Promise<{
    materialId: string;
    attemptId: string;
  }>;
}) => {
  const { materialId, attemptId } = await params;

  return <ResultsPageClient materialId={materialId} attemptId={attemptId} />;
};

export default ResultsPage;
