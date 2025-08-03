import Subtitle from "@/shared/components/subtitle";
import React, { FC } from "react";

const EmptyMaterialItem: FC = () => {
  return (
    <div className="flex items-center justify-center h-[200px] w-full rounded-2xl p-2 m-2 border-3 border-neutral-600 border-dashed">
      <Subtitle text="No materials yet..." textStyles="text-neutral-500" />
    </div>
  );
};

export default EmptyMaterialItem;
