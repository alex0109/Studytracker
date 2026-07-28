"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  questionKeys,
  createOptionsQuestion,
  IOptionsQuestionRequest,
} from "@/entities/question";
import { toast } from "@/shared/radix-ui";

export const useOptionsQuestionCreate = (materialId: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createOptionsQuestionMutation = useMutation({
    mutationFn: (body: IOptionsQuestionRequest) => {
      return createOptionsQuestion(token, materialId, body);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: "✅Question has been created",
        variant: "success",
      });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${materialId}/questions/options (create)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occured while creating question",
        variant: "error",
      });
    },
  });

  return {
    createOptionsQuestion: createOptionsQuestionMutation.mutate,
  };
};
