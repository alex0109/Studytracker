"use client";

import { useEffect, useState } from "react";
import { ContainerColumn, PieChart, Subtitle } from "@/shared/ui";
import useMaterialStats from "../../../../entities/material/hooks/useMaterialStats";
import { validateStatusesData, validateTypesData } from "@/shared/lib";

const Chart = () => {
  const [pieTypeData, setPieTypeData] = useState([{ x: "No data", y: 0 }]);
  const [pieStatusData, setPieStatusData] = useState([{ x: "No data", y: 0 }]);
  const { statsData } = useMaterialStats();

  useEffect(() => {
    setPieTypeData(validateTypesData(statsData));
    setPieStatusData(validateStatusesData(statsData));
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

export default Chart;
