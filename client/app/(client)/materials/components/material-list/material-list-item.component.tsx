import { MaterialType } from "@/app/types/types";
import StatusBadge from "@/shared/components/status-badge";
import Subtitle from "@/shared/components/subtitle";
import Title from "@/shared/components/title";
import React, { FC } from "react";

const MaterialListItem: FC<MaterialType> = ({ title, type, status }) => {
  return (
    <div className="bg-neutral-900 h-[200px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px] flex flex-col items-center rounded-2xl p-2 m-2 cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Title text={title} textStyles="text-white" />
      <StatusBadge status={status ? status : "finished"} />
      <Subtitle text={type ? type : "article"} textStyles="text-white" />
    </div>
  );
};

export default MaterialListItem;
