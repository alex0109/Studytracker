"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { BlockColumn, IsPendingLoader } from "@/shared/ui";
import { AttemptHeader } from "@/entities/attempt/ui";
import { Separator, Button } from "@/shared/radix-ui";
import { shuffleQuestions } from "@/widgets/Attempt/lib/shuffle-questions";
import { AttemptQuestion } from "@/widgets/Attempt/ui/AttemptQuestion/attempt-question";
import { IQuestionReduced } from "@/entities/question";
import { useAttemptFinish } from "@/features/attempt/finish-attempt";
import { useAttemptResults } from "@/entities/attempt";

interface AttemptProps {
  questionsActiveReduced: IQuestionReduced[];
  materialId: string;
  attemptId: string;
}

export const Attempt: FC<AttemptProps> = ({
  questionsActiveReduced,
  materialId,
  attemptId,
}) => {
  const [questions] = useState(() =>
    shuffleQuestions([...questionsActiveReduced]),
  );
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();

  const { finishAttempt, finishAttemptIsPending } = useAttemptFinish(attemptId);

  const handleFinishAttempt = async () => {
    setIsDisabled(true);
    const unanswered = questions.some((q) => !answers[q.id]);

    if (unanswered) {
      setIsDisabled(false);
      return;
    }

    await finishAttempt();

    router.push(`/materials/${materialId}/attempt/${attemptId}/results`);
  };

  return (
    <BlockColumn>
      <AttemptHeader materialId={materialId} attemptId={attemptId} />
      <Separator />
      {questions.map((item, i) => (
        <AttemptQuestion
          key={item.id}
          questionId={item.id}
          attemptId={attemptId}
          index={i + 1}
          title={item.title}
          answers={answers[item.id]}
          onAnswered={(answer) =>
            setAnswers((prev) => ({
              ...prev,
              [item.id]: [...(prev[item.id] ?? []), answer],
            }))
          }
        />
      ))}
      <Separator className="my-10" />
      <div className="flex w-full justify-center items-center">
        <div className="flex-1" />
        <div className="flex flex-1 justify-center items-center">
          <Button
            className="w-60 text-md bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
            size="lg"
            variant="outline"
            disabled={isDisabled}
            onClick={() => handleFinishAttempt()}
          >
            Finish
          </Button>
        </div>
        <div className="flex-1">
          <IsPendingLoader isPending={finishAttemptIsPending} />
        </div>
      </div>
    </BlockColumn>
  );
};
