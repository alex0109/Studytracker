"use client";

import ContainerColumn from "@/shared/components/container-column";
import PieChart from "@/shared/components/pie";
import Subtitle from "@/shared/components/subtitle";
import { useEffect, useState } from "react";
import useMaterialStats from "../../materials/hooks/useMaterialStats.hook";
import {
  validateStatusesData,
  validateTypesData,
} from "@/shared/lib/utils/data-validate.util";

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
