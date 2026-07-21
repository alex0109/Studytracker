"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const MaterialsLoading = () => {
  return (
    <>
      <BlockColumn blockStyles="bg-none">
        <div className="flex w-full justify-between">
          <div className="flex flex-col flex-1 p-5 justify-center items-center">
            <Skeleton className="w-full h-10" />
            <Skeleton className="rounded-4xl w-[50px] h-[50px] my-2" />
          </div>
          <div className="flex flex-col flex-1 p-5 justify-center items-center">
            <Skeleton className="w-full h-10" />
            <Skeleton className="rounded-4xl w-[50px] h-[50px] my-2" />
          </div>
        </div>
      </BlockColumn>
      <BlockColumn>
        <div className="flex flex-col gap-5 w-full mb-5 justify-start items-center">
          <Skeleton className="min-w-[250px] lg:w-[400px] md:w-[350px] sm:w-[300px] h-10" />
          <Skeleton className="w-[100px] h-8" />
        </div>
        <div className="flex flex-col gap-8 justify-start items-center">
          <Skeleton className="h-[200px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          <Skeleton className="h-[200px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          <Skeleton className="h-[200px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialsLoading;
