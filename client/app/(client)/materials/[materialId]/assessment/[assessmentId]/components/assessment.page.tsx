"use client";

import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import AssessmentHeader from "./assessment-header.component";
import { Separator } from "@/shared/components/ui/separator";
import { shuffleInPlace } from "@/app/(client)/materials/utils/shuffle.util";
import QuestionItem from "./question.component";
import { Button } from "@/shared/components/ui/button";
import { IQuestionReduced } from "@/app/types/question/question.type";
import useAssessmentSubmitAnswer from "@/app/(client)/materials/hooks/assessment/useAssessmentSubmitAnswer.hook";
import useAssessmentFinish from "@/app/(client)/materials/hooks/assessment/useAssessmentFinish.hook";
import { useRouter } from "next/navigation";

interface AssessmentPageProps {
  questionsReduced: IQuestionReduced[];
  materialId: string;
  assessmentId: string;
}

const AssessmentPage: FC<AssessmentPageProps> = ({
  questionsReduced,
  materialId,
  assessmentId,
}) => {
  const router = useRouter();

  const { submitAnswer } = useAssessmentSubmitAnswer(assessmentId);
  const { finishAssessment } = useAssessmentFinish(assessmentId);

  const handleFinishAssessment = () => {
    finishAssessment();
    // router.back();
  };

  return (
    <BlockColumn>
      <AssessmentHeader materialId={materialId} assessmentId={assessmentId} />
      <Separator />
      {shuffleInPlace(questionsReduced).map((item, i) => (
        <QuestionItem
          key={item.id}
          questionId={item.id}
          assessmentId={assessmentId}
          index={i + 1}
          title={item.title}
          submitAnswer={submitAnswer}
        />
      ))}
      <Separator className="my-10" />
      <Button
        className="text-md bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
        size="lg"
        variant="outline"
        onClick={() => handleFinishAssessment()}
      >
        Finish
      </Button>
    </BlockColumn>
  );
};

export default AssessmentPage;
