"use client";

import { useEffect, useState } from "react";
import { ContainerColumn, PieChart, Subtitle } from "@/shared/ui";
import { useStatistics } from "@/entities/material";
import { validateStatuses, validateTypes } from "../../lib";

export const StatisticalChart = () => {
  const [pieTypeData, setPieTypeData] = useState([{ x: "No data", y: 0 }]);
  const [pieStatusData, setPieStatusData] = useState([{ x: "No data", y: 0 }]);
  const { statsData } = useStatistics();

  useEffect(() => {
    setPieTypeData(validateTypes(statsData));
    setPieStatusData(validateStatuses(statsData));
  }, [statsData]);

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
