import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IQuestion } from "@/app/types/question/question.type";
import { getOneQuestionService } from "../../services/question.service";
import { questionKeys } from "../querykeys/question.query.keys";

const useQuestionExact = (materialId: string, id: string) => {
  const { token, user } = useSession();

  const questionExact = useQuery<IQuestion, Error>({
    queryKey: questionKeys.detail(materialId, id),
    queryFn: ({ queryKey }) => {
      return getOneQuestionService(
        token,
        queryKey[1] as string,
        queryKey[2] as string,
      );
    },
    enabled: !!materialId && !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionExact.error) {
      logExceptionError(questionExact.error, {
        section: `materials/${materialId}/questions/${id}`,
        userID: user?.id,
      });
    }
  }, [questionExact.error]);

  return {
    questionExact: questionExact.data,
    questionExactLoading: questionExact.isLoading,
    questionExactError: questionExact.error,
  };
};

export default useQuestionExact;
