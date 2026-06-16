"use client";

import BlockColumn from "@/shared/components/block-column";
import { Skeleton } from "@/shared/components/ui/skeleton";

const MaterialError = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default MaterialError;
