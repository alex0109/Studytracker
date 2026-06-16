import { getUser } from "@/shared/queries/user";
import { getReducedQuestionsService } from "../../../services/question.service";
import AssessmentPage from "./components/assessment.page";

const Assessment = async ({
  params,
}: {
  params: Promise<{ materialId: string; assessmentId: string }>;
}) => {
  const { materialId, assessmentId } = await params;
  const { token } = await getUser();

  const questionsReduced = await getReducedQuestionsService(token, materialId);
  return (
    <AssessmentPage
      questionsReduced={questionsReduced}
      materialId={materialId}
      assessmentId={assessmentId}
    />
  );
};

export default Assessment;
