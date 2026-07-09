"use client";

import { FC, useEffect, useState } from "react";
import { BlockColumn, Title, PieChart, Subtitle } from "@/shared/ui";
import { validateStatusesData, validateTypesData } from "@/shared/lib";
import useMaterialStats from "@/entities/material/hooks/useMaterialStats";

const MaterialsPanel: FC = () => {
  const { statsData } = useMaterialStats();
  const [pieTypeData, setPieTypeData] = useState([{ x: "No data", y: 0 }]);
  const [pieStatusData, setPieStatusData] = useState([{ x: "No data", y: 0 }]);

  useEffect(() => {
    setPieTypeData(validateTypesData(statsData));
    setPieStatusData(validateStatusesData(statsData));
  }, [statsData]);

  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text={`Materials (${statsData?.count})`} />
        <Subtitle text="Statuses" />
        <div className="w-full border-b-1 border-b-neutral-700">
          <PieChart chartData={pieTypeData} />
        </div>
        <Subtitle text="Type" />
        <div className="w-full">
          <PieChart chartData={pieStatusData} />
        </div>
      </BlockColumn>
    </div>
  );
};

export default MaterialsPanel;
