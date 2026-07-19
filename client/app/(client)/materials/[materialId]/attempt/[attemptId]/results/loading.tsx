"use client";

import { BlockColumn, Subtitle } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const ResultsLoading = () => {
  return (
    <BlockColumn blockStyles="bg-none">
      <Skeleton className="w-full h-screen " />
      <Subtitle text="Loading content..." />
    </BlockColumn>
  );
};

export default ResultsLoading;
