import React from "react";
import { Subtitle } from "@/shared/ui";

export const EmptySection = () => {
  return (
    <div className="flex flex-3 flex-col justify-center items-center gap-3 bg-transparent min-h-[500px] rounded-2xl p-5">
      <Subtitle text="Create new material and dive deep into studying!" />
      <p className="text-neutral-500">Keep up, we believe in you!</p>
    </div>
  );
};
