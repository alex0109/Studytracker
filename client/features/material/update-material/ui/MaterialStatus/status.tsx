"use client";

import { FC, useEffect, useState } from "react";
import { MaterialStatusEnum, StatusBadgeSelect } from "@/entities/material";
import { useDebounce } from "@/shared/hooks";
import { IsPendingLoader, Subtitle } from "@/shared/ui";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialStatusType {
  id: string;
  materialStatus: MaterialStatusEnum;
}

export const MaterialStatus: FC<MaterialStatusType> = ({
  id,
  materialStatus,
}) => {
  const [statusValue, setStatusValue] =
    useState<MaterialStatusEnum>(materialStatus);

  const { updateMaterial, updateMaterialIsPending } = useMaterialUpdate(id);

  const updateStatusHandler = (
    materialId: string,
    status: MaterialStatusEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { status } });
  };

  const debouncedStatusValue = useDebounce(statusValue, 1500);

  useEffect(() => {
    if (materialStatus !== debouncedStatusValue) {
      updateStatusHandler(id, debouncedStatusValue);
    }
  }, [id, materialStatus, debouncedStatusValue]);

  const onUpdateStatus = (id: string, newStatus: MaterialStatusEnum) => {
    setStatusValue(newStatus);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-7">
      <Subtitle text="Status: " />
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
      <div className="flex-1 h-10">
        <IsPendingLoader isPending={updateMaterialIsPending} />
      </div>
    </div>
  );
};
