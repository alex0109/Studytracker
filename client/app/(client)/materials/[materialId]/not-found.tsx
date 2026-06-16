"use client";

import BlockColumn from "@/shared/components/block-column";
import { Skeleton } from "@/shared/components/ui/skeleton";

const MaterialNotFound = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default MaterialNotFound;
