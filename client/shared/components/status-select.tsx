import { FC, ReactNode } from "react";
import { MaterialStatusEnum } from "@/app/types/material/material.status.type";

interface StatusBadgeSelectProps {
  status: MaterialStatusEnum | undefined;
  children: ReactNode;
}

const StatusBadgeSelect: FC<StatusBadgeSelectProps> = ({
  status,
  children,
}) => {
  if (!status) {
    return <div className="w-[130px] bg-neutral-500"></div>;
  }

  return (
    <div
      className={`w-[130px] p-2 rounded-2xl text-white text-center ${
        status == "tolearn"
          ? "bg-sky-500"
          : status == "inprocess"
            ? "bg-purple-500"
            : status == "finished"
              ? "bg-emerald-500"
              : "bg-neutral-500"
      }`}
    >
      {children}
    </div>
  );
};

export default StatusBadgeSelect;
