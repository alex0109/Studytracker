"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { BlockColumn } from "@/shared/ui";
import { AttemptHeader } from "@/entities/attempt/ui";
import { Separator, Button } from "@/shared/radix-ui";
import { shuffleQuestions } from "@/widgets/Attempt/lib/shuffle-questions";
import { AttemptQuestion } from "@/widgets/Attempt/ui/AttemptQuestion/attempt-question";
import { IQuestionReduced } from "@/entities/question";
import { useAttemptFinish } from "@/features/attempt/finish-attempt";
import { useAttemptResults } from "@/entities/attempt";

interface AttemptProps {
  questionsReduced: IQuestionReduced[];
  materialId: string;
  attemptId: string;
}

export const Attempt: FC<AttemptProps> = ({
  questionsReduced,
  materialId,
  attemptId,
}) => {
  const [questions] = useState(() => shuffleQuestions([...questionsReduced]));
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const router = useRouter();

  const { finishAttempt } = useAttemptFinish(attemptId);
  const { attemptResults } = useAttemptResults(attemptId);

  const handleFinishAttempt = async () => {
    const unanswered = questions.some((q) => !answers[q.id]);

    if (unanswered) {
      alert("Please answer all questions");
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
      <Button
        className="text-md bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
        size="lg"
        variant="outline"
        onClick={() => handleFinishAttempt()}
      >
        Finish
      </Button>
    </BlockColumn>
  );
};
