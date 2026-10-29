"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

// Widths are caps, not minimums: a fixed 500px row made the page wider than a phone
// while it loaded, and the browser zoomed out to fit it
const MaterialsIsPending = () => {
  return (
    <BlockColumn>
      <div className="flex flex-col gap-5 w-full mb-5 justify-start items-center">
        <Skeleton className="w-full max-w-[400px] h-10" />
        <Skeleton className="w-[100px] h-8" />
      </div>
      <div className="flex flex-col w-full gap-3 justify-start items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="flex w-full max-w-[800px] h-[50px] items-center gap-4 px-2"
          >
            <Skeleton className="h-[50px] w-[50px] shrink-0" />
            <Skeleton className="h-[50px] flex-1" />
          </div>
        ))}
      </div>
    </BlockColumn>
  );
};

export default MaterialsIsPending;
