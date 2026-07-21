import { BlockColumn } from "@/shared/ui";
import { ResultsPageClient } from "./results-page-client";
import { Skeleton } from "@/shared/radix-ui";

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
