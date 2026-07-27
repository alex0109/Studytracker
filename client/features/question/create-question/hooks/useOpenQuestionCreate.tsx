"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  questionKeys,
  createOpenQuestion,
  IOpenQuestionRequest,
} from "@/entities/question";

export const useOpenQuestionCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createOpenQuestionMutation = useMutation({
    mutationFn: (body: IOpenQuestionRequest) => {
      return createOpenQuestion(token, materialId, body);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: questionKeys.list(materialId),
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/open (create)`,
        userID: user?.id,
      });
    },
  });

  return {
    createOpenQuestion: createOpenQuestionMutation.mutate,
    createOpenQuestionIsPending: createOpenQuestionMutation.isPending,
  };
};
