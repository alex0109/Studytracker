"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import {
  questionKeys,
  createTrueFalseQuestion,
  ITrueFalseQuestionRequest,
} from "@/entities/question";
import { toast } from "@/shared/radix-ui";

export const useTrueFalseQuestionCreate = (
  materialId: string,
  noteId?: string,
) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createTrueFalseQuestionMutation = useMutation({
    mutationFn: (body: ITrueFalseQuestionRequest) => {
      return createTrueFalseQuestion(token, materialId, body, noteId);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: questionKeys.list(materialId),
      });

      toast({
        title: "✅Question has been created!",
        variant: "success",
      });
    },
    onError: (error) => {
      // Limit reached: show why and refresh the counter, this is not a bug to report
      const limitMessage = getLimitErrorMessage(error);
      if (limitMessage) {
        queryClient.invalidateQueries({ queryKey: questionKeys.list(materialId) });
        toast({ title: `⚠️${limitMessage}`, variant: "error" });
        return;
      }

      logExceptionError(error, {
        section: `materials/${materialId}/questions/true-false (create)`,
        userID: user?.id,
      });

      toast({
        title: "❌Error occurred while creating question",
        variant: "error",
      });
    },
  });

  return {
    createTrueFalseQuestion: createTrueFalseQuestionMutation.mutate,
    createTrueFalseQuestionIsPending: createTrueFalseQuestionMutation.isPending,
  };
};
