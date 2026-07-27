"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const MaterialsLoading = () => {
  return (
    <BlockColumn>
      <div className="flex flex-col gap-5 w-full mb-5 justify-start items-center">
        <Skeleton className="min-w-[250px] lg:w-[400px] md:w-[350px] sm:w-[300px] h-10" />
        <Skeleton className="w-[100px] h-8" />
      </div>
      <div className="flex flex-col w-full gap-3  justify-start items-center">
        <div className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]">
          <div className="flex justify-center items-center flex-1 h-full mx-2">
            <Skeleton className="h-[50px] w-[50px]" />
          </div>
          <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2">
            <Skeleton className="h-[50px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]">
          <div className="flex justify-center items-center flex-1 h-full mx-2">
            <Skeleton className="h-[50px] w-[50px]" />
          </div>
          <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2">
            <Skeleton className="h-[50px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]">
          <div className="flex justify-center items-center flex-1 h-full mx-2">
            <Skeleton className="h-[50px] w-[50px]" />
          </div>
          <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2">
            <Skeleton className="h-[50px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]">
          <div className="flex justify-center items-center flex-1 h-full mx-2">
            <Skeleton className="h-[50px] w-[50px]" />
          </div>
          <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2">
            <Skeleton className="h-[50px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]">
          <div className="flex justify-center items-center flex-1 h-full mx-2">
            <Skeleton className="h-[50px] w-[50px]" />
          </div>
          <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2">
            <Skeleton className="h-[50px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px]" />
          </div>
        </div>
      </div>
    </BlockColumn>
  );
};

export default MaterialsLoading;
