import { MaterialStatusEnum } from "@/app/types/material/material.status.type";
import StatusBadgeSelect from "@/shared/components/status-select";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import React, { FC, useEffect, useState } from "react";

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
  const [statusValue, setStatusValue] =
    useState<MaterialStatusEnum>(materialStatus);

  const debouncedStatusValue = useDebounce(statusValue, 1000);

  useEffect(() => {
    if (materialStatus !== debouncedStatusValue) {
      updateStatusHandler(id, debouncedStatusValue);
    }
  }, [id, materialStatus, debouncedStatusValue]);

  const onUpdateStatus = (id: string, newStatus: MaterialStatusEnum) => {
    setStatusValue(newStatus);
  };

  return (
    <div>
      <span className="italic">Status</span>
      <StatusBadgeSelect status={statusValue}>
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
