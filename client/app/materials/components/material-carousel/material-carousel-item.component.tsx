import Subtitle from "@/shared/components/subtitle";
import React, { FC } from "react";

import StatusBadge from "@/shared/components/status-badge";
import { MaterialType } from "@/app/types/types";

const MaterialItem: FC<MaterialType> = ({ title, tags, status }) => {
  return (
    <div className="bg-neutral-900 h-[200px] w-[250px] rounded-2xl p-2 m-2 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Subtitle text={title} textStyles="text-white" />
      <div className="w-full flex justify-center">
        <StatusBadge status={status ? status : "finished"} size="mini" />
      </div>
      <div className="flex flex-col justify-between h-[70px] my-3">
        <div className="flex flex-wrap gap-2">
          {tags?.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="bg-blue-200 text-blue-800 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialItem;
