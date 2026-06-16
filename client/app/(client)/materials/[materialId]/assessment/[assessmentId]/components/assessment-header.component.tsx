"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import Title from "@/shared/components/title";
import Subtitle from "@/shared/components/subtitle";

interface AssessmentHeaderProps {
  materialId: string;
  assessmentId: string;
}

const AssessmentHeader: FC<AssessmentHeaderProps> = ({
  materialId,
  assessmentId,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center w-full">
      <Button className="self-start" onClick={() => router.back()}>
        Go Back
      </Button>
      <Title text="Assessment" />
      <Subtitle text={`Material ID: ${materialId}`} />
      <Subtitle text={`Assessment ID: ${assessmentId}`} />
    </div>
  );
};

export default AssessmentHeader;
