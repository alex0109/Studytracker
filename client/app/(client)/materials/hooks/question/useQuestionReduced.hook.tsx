import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IQuestion } from "@/app/types/question/question.type";
import { getAllQuestionsService } from "../../services/question.service";
import { questionKeys } from "../querykeys/question.query.keys";

const useQuestionsReduced = (materialId: string) => {
  const { token, user } = useSession();

  const questionsReduced = useQuery<IQuestion[], Error>({
    queryKey: questionKeys.list(materialId),
    queryFn: () => {
      return getAllQuestionsService(token, materialId);
    },
    enabled: !!materialId && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (questionsReduced.error) {
      logExceptionError(questionsReduced.error, {
        section: `materials/${materialId}/questions/assessment`,
        userID: user?.id,
      });
    }
  }, [questionsReduced.error]);

  return {
    questionsReducedData: questionsReduced.data,
    questionsReducedLoading: questionsReduced.isLoading,
    questionsReducedError: questionsReduced.error,
  };
};

export default useQuestionsReduced;
