import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IQuestion } from "@/app/types/question/question.type";
import { getAllQuestionsService } from "../../services/question.service";
import { questionKeys } from "../querykeys/question.query.keys";

const useQuestionAll = (materialId: string) => {
  const { token, user } = useSession();

  const questions = useQuery<IQuestion[], Error>({
    queryKey: questionKeys.list(materialId),
    queryFn: () => {
      return getAllQuestionsService(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questions.error) {
      logExceptionError(questions.error, {
        section: `materials/${materialId}/questions`,
        userID: user?.id,
      });
    }
  }, [questions.error]);

  return {
    questionsData: questions.data,
    questionsLoading: questions.isLoading,
    questionsError: questions.error,
  };
};

export default useQuestionAll;
