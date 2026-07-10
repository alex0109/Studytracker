"use client";

import { BlockColumn } from "@/shared/ui";
import { Skeleton } from "@/shared/radix-ui";

const MaterialError = () => {
  return (
    <BlockColumn>
      <Skeleton className="w-full h-[90px]" />
    </BlockColumn>
  );
};

export default MaterialError;
