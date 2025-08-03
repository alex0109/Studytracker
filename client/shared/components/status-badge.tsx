import React, { FC } from "react";

interface StatusBarProps {
  status: "tolearn" | "inprocess" | "finished";
  size: "normal" | "mini";
}

const StatusBadge: FC<StatusBarProps> = ({ status, size = "normal" }) => {
  return size == "mini" ? (
    <p
      className={`${
        status == "tolearn"
          ? "text-sky-500"
          : status == "inprocess"
          ? "text-purple-500"
          : status == "finished"
          ? "text-emerald-500"
          : "text-neutral-500"
      }`}
    >
      {status == "tolearn" && <p>Want to learn</p>}
      {status == "inprocess" && <p>In process</p>}
      {status == "finished" && <p>Finished</p>}
    </p>
  ) : (
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
      {status == "tolearn" && <p>Want to learn</p>}
      {status == "inprocess" && <p>In process</p>}
      {status == "finished" && <p>Finished</p>}
    </div>
  );
};

export default StatusBadge;
