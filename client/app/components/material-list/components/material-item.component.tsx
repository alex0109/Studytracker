import Subtitle from "@/shared/components/subtitle";
import Text from "@/shared/components/text";
import React, { FC } from "react";
import { MaterialItemProps } from "../types";

const MaterialItem: FC<MaterialItemProps> = ({ title, tag, status }) => {
  return (
    <div className="bg-neutral-900 h-[200px] w-[250px] rounded-2xl p-2 m-2 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Subtitle text={title} textStyles="text-white" />
      <span className="text-neutral-300">Tags: </span>
      <Text text={tag} textStyles="text-white" />
      <span className="text-neutral-300">Status: </span>
      <Text text={status} textStyles="text-white" />
    </div>
  );
};

export default MaterialItem;
