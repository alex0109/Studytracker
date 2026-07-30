"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const ResultsIsPending = () => {
  return (
    <>
      <BlockColumn>
        <div className="flex justify-center items-center">
          <Skeleton className="w-[200px] h-12" />
        </div>
      </BlockColumn>
      <BlockColumn>
        <div className="flex flex-col w-full gap-3 justify-center items-center px-10">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      </BlockColumn>
      <BlockColumn>
        <div className="flex w-full justify-center items-center px-10">
          <Skeleton className="w-full h-[400px]" />
        </div>
      </BlockColumn>
    </>
  );
};

export default ResultsIsPending;
