"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const AssessmentError = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default AssessmentError;
