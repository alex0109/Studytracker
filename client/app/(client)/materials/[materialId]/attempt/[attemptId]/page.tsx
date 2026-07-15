import { getUser } from "@/entities/auth/model/get-current-user.supabase";
import { getReducedQuestions } from "@/entities/question";
import { Attempt } from "@/widgets/Attempt/ui";

const AttemptPage = async ({
  params,
}: {
  params: Promise<{ materialId: string; attemptId: string }>;
}) => {
  const { materialId, attemptId } = await params;
  const { token } = await getUser();

  const questionsReduced = await getReducedQuestions(token, materialId);

  return (
    <Attempt
      questionsReduced={questionsReduced}
      materialId={materialId}
      attemptId={attemptId}
    />
  );
};

export default AttemptPage;
