"use client";

import { BlockColumn, ContainerColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const MaterialIsPending = () => {
  return (
    <>
      <BlockColumn blockStyles="bg-none">
        <div className="flex flex-col w-full">
          <div className="flex w-full justify-between items-center">
            <Skeleton className="w-[100px] h-10" />
            <Skeleton className="w-[100px] h-10" />
          </div>
          <div className="flex flex-col w-full gap-3 justify-center items-center">
            <Skeleton className="w-[150px] h-8" />
            <Skeleton className="w-[100px] h-8" />
          </div>
        </div>
      </BlockColumn>
      <ContainerColumn>
        <div className="flex w-full gap-4 justify-center items-center">
          <Skeleton className="w-[150px] h-10" />
          <Skeleton className="w-[150px] h-10" />
        </div>
      </ContainerColumn>
      <BlockColumn blockStyles="bg-none">
        <div className="flex flex-col w-full px-10 gap-2 justify-center items-center">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-[400px]" />
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialIsPending;
