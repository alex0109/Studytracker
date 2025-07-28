import React, { FC } from "react";

interface ProgressBadgeProps {
  status: "tolearn" | "inprocess" | "finished";
  value: string;
}

const ProgressBadge: FC<ProgressBadgeProps> = ({ status, value }) => {
  return (
    <div
      className={`p-2 ${
        status == "tolearn"
          ? "bg-sky-500"
          : status == "inprocess"
          ? "bg-purple-500"
          : status == "finished"
          ? "bg-emerald-500"
          : "bg-neutral-500"
      } rounded-2xl`}
    >
      <p>{value}</p>
    </div>
  );
};

export default ProgressBadge;
