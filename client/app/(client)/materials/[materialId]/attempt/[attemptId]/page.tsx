import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import { getUser } from "@/entities/auth/model/get-current-user.supabase";
import { getAttemptQuestions } from "@/entities/attempt";
import { Attempt } from "@/widgets/Attempt/ui";

const AttemptPage = async ({
  params,
}: {
  params: Promise<{ materialId: string; attemptId: string }>;
}) => {
  const { materialId, attemptId } = await params;
  const { token } = await getUser();

  const questions = await getAttemptQuestions(token, attemptId).catch((error) => {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });

  return (
    <Attempt
      questions={questions}
      materialId={materialId}
      attemptId={attemptId}
    />
  );
};

export default AttemptPage;
