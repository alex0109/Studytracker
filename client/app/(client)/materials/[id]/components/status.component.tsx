import { MaterialStatusEnum } from "@/app/types/types";
import StatusBadgeSelect from "@/shared/components/status-select";
import React, { FC, useState } from "react";

interface MaterialStatusType {
  id: string;
  materialStatus: MaterialStatusEnum;
  updateStatusHandler: (id: string, status: MaterialStatusEnum) => void;
}

const MaterialStatus: FC<MaterialStatusType> = ({
  id,
  materialStatus,
  updateStatusHandler,
}) => {
  const [selectStatus, setSelectStatus] =
    useState<MaterialStatusEnum>(materialStatus);

  const onUpdateStatus = (id: string, newStatus: MaterialStatusEnum) => {
    setSelectStatus(newStatus);
    updateStatusHandler(id, newStatus);
  };

  return (
    <div>
      <span className="italic">Status</span>
      <StatusBadgeSelect status={selectStatus}>
        <select
          className="text-white outline-none cursor-pointer"
          onChange={(e) =>
            onUpdateStatus(id, e.target.value as MaterialStatusEnum)
          }
        >
          <option value="tolearn">Want to learn</option>
          <option value="inprocess">In process</option>
          <option value="finished">Finished</option>
        </select>
      </StatusBadgeSelect>
    </div>
  );
};

export default MaterialStatus;
