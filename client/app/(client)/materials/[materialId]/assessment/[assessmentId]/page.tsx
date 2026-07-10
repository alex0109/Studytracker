import { getUser } from "@/shared/api";
import { getReducedQuestions } from "@/entities/question";
import AssessmentPage from "./components/assessment.page";

const Assessment = async ({
  params,
}: {
  params: Promise<{ materialId: string; assessmentId: string }>;
}) => {
  const { materialId, assessmentId } = await params;
  const { token } = await getUser();

  const questionsReduced = await getReducedQuestions(token, materialId);
  return (
    <AssessmentPage
      questionsReduced={questionsReduced}
      materialId={materialId}
      assessmentId={assessmentId}
    />
  );
};

export default Assessment;
