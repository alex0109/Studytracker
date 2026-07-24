import { getUser } from "@/entities/auth/model/get-current-user.supabase";
import { getActiveReducedQuestions } from "@/entities/question";
import { Attempt } from "@/widgets/Attempt/ui";

const AttemptPage = async ({
  params,
}: {
  params: Promise<{ materialId: string; attemptId: string }>;
}) => {
  const { materialId, attemptId } = await params;
  const { token } = await getUser();

  const questionsActiveReduced = await getActiveReducedQuestions(
    token,
    materialId,
  );

  return (
    <Attempt
      questionsActiveReduced={questionsActiveReduced}
      materialId={materialId}
      attemptId={attemptId}
    />
  );
};

export default AttemptPage;
