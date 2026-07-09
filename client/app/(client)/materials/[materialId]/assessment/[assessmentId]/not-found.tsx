"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui/Skeleton/skeleton";

const AssessmentNotFound = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default AssessmentNotFound;
