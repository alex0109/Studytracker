"use client";

import { FC } from "react";
import { LuThumbsUp } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { useAcceptAnswer } from "../hooks/useAcceptAnswer";

interface AcceptAnswerButtonProps {
  attemptId: string;
  resultId: string;
}

// Similarity and AI checks can miss a right answer worded differently: the user decides
export const AcceptAnswerButton: FC<AcceptAnswerButtonProps> = ({ attemptId, resultId }) => {
  const { t } = useTranslation();
  const { acceptAnswer, acceptAnswerIsPending } = useAcceptAnswer(attemptId);

  return (
    <Button
      variant="outline"
      size="sm"
      title={t("results.acceptHint")}
      disabled={acceptAnswerIsPending}
      onClick={() => acceptAnswer(resultId)}
      className="self-start"
    >
      <LuThumbsUp aria-hidden /> {t("results.accept")}
    </Button>
  );
};
