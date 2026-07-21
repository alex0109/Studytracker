"use client";

import { BlockColumn } from "@/shared/ui";
import { Separator, Skeleton } from "@/shared/radix-ui";

const AttemptLoading = () => {
  return (
    <BlockColumn blockStyles="bg-none">
      <div className="flex flex-col w-full gap-3">
        <div className="flex justify-start items-center">
          <Skeleton className="w-[100px] h-10" />
        </div>
        <div className="flex w-full justify-center items-center p-5">
          <Skeleton className="w-[150px] h-10" />
        </div>
        <Separator />
        <div className="flex flex-col w-full gap-2 justify-center items-center p-10">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-[400px]" />
        </div>
        <div className="flex flex-col w-full gap-2 justify-center items-center p-10">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-[400px]" />
        </div>
      </div>
    </BlockColumn>
  );
};

export default AttemptLoading;
