import { FC } from "react";
import moment from "moment";
import { IMaterialResponse, StatusBadge } from "@/entities/material";
import TypeBadge from "@/entities/material/ui/TypeBadge/type-badge";

export const MaterialListItem: FC<IMaterialResponse> = ({
  title,
  type,
  status,
  updatedAt,
}) => {
  return (
    <div
      className="flex flex-1 justify-center items-center h-[50px] min-w-[500px] lg:w-[800px] md:w-[520px] sm:w-[600px]
                cursor-pointer hover:scale-105 ease-in-out 
                duration-300 overflow-hidden"
    >
      <div className="flex justify-center items-center flex-1 h-full mx-2">
        <StatusBadge status={status} />
      </div>
      <div className="flex w-full h-[50px] justify-center items-center mx-2 px-2 rounded-2xl bg-neutral-200">
        <div className="flex-1">
          <p className="text-black">
            <TypeBadge type={type} /> {title}
          </p>
        </div>
        <div className="flex flex-1 w-full justify-end px-2">
          <p className="text-black">{moment(updatedAt).format("DD MMMM yy")}</p>
        </div>
      </div>
    </div>
  );
};
