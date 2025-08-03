import StatusBadge from "@/shared/components/status-badge";
import Subtitle from "@/shared/components/subtitle";
import Title from "@/shared/components/title";
import React, { FC } from "react";
import { MaterialType } from "../material-carousel/types";

const MaterialListItem: FC<MaterialType> = ({ title, type, status }) => {
  return (
    <div className="bg-neutral-900 h-[200px] flex flex-col w-2xl items-center rounded-2xl p-2 m-2 cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Title text={title} textStyles="text-white" />
      <StatusBadge status={status} />
      <Subtitle text={type} textStyles="text-white" />
    </div>
  );
};

export default MaterialListItem;
