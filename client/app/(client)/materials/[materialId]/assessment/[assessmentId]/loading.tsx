"use client";

import BlockColumn from "@/shared/components/block-column";
import Subtitle from "@/shared/components/subtitle";
import { Skeleton } from "@/shared/components/ui/skeleton";

const AssessmentLoading = () => {
  return (
    <BlockColumn blockStyles="bg-none">
      <Skeleton className="w-full h-screen " />
      <Subtitle text="Loading content..." />
    </BlockColumn>
  );
};

export default AssessmentLoading;
