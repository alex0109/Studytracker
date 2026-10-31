"use client";

import { ContainerColumn, PieChart, Subtitle } from "@/shared/ui";
import { useStatistics } from "@/entities/material";
import { validateStatuses, validateTypes } from "../../lib";

export const StatisticalChart = () => {
  const { statsData } = useStatistics();
  const pieTypeData = validateTypes(statsData);
  const pieStatusData = validateStatuses(statsData);

  return (
    <ContainerColumn blockStyles="justify-center">
      <Subtitle text="Status" />
      <div className="w-full border-b border-b-neutral-700">
        <PieChart chartData={pieTypeData} />
      </div>
      <Subtitle text="Type" />
      <div className="w-full">
        <PieChart chartData={pieStatusData} />
      </div>
    </ContainerColumn>
  );
};
