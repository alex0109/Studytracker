"use client";

import BlockColumn from "@/shared/components/block-column";
import { Skeleton } from "@/shared/components/ui/skeleton";

const AssessmentNotFound = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default AssessmentNotFound;
