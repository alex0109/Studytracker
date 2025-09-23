import Subtitle from "@/shared/components/subtitle";
import Text from "@/shared/components/text";
import React, { FC } from "react";

import StatusBadge from "@/shared/components/status-badge";
import { MaterialType } from "@/app/types/types";

const MaterialItem: FC<MaterialType> = ({ title, tag, status }) => {
  return (
    <div className="bg-neutral-900 h-[200px] w-[250px] rounded-2xl p-2 m-2 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Subtitle text={title} textStyles="text-white" />
      <div className="flex flex-col">
        <div className="flex">
          <span className="text-neutral-300">Tags:&ensp;</span>
          <Text text={tag ?? ""} textStyles="text-white" />
        </div>
        <div className="flex">
          <span className="text-neutral-300">Status:&ensp;</span>
          <StatusBadge status={status ? status : "finished"} size="mini" />
        </div>
      </div>
    </div>
  );
};

export default MaterialItem;
