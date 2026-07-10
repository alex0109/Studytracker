import { FC } from "react";
import { IMaterialResponse } from "@/entities/material";
import { StatusBadge, Subtitle, Text, Title } from "@/shared/ui";
import moment from "moment";

const MaterialListItem: FC<IMaterialResponse> = ({
  title,
  type,
  status,
  createdAt,
}) => {
  return (
    <div className="bg-neutral-900 h-[200px] min-w-[300px] lg:w-[630px] md:w-[420px] sm:w-[300px] flex flex-col items-center rounded-2xl p-2 m-2 cursor-pointer hover:scale-105 ease-in-out duration-300 overflow-hidden">
      <Title text={title} textStyles="text-white" />
      <StatusBadge status={status} />
      <Subtitle text={type ? type : "no type"} textStyles="text-white" />
      <div className="w-full">
        <Text
          textStyles="text-neutral-400"
          text={moment(createdAt).format("DD MMMM yy")}
        />
      </div>
    </div>
  );
};

export default MaterialListItem;
