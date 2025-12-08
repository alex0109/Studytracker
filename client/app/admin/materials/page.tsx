"use client";

import { FC, useEffect, useState } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";
import useAdminMaterials from "./hooks/useAdminMaterials.hook";
import {
  validateStatusesData,
  validateTypesData,
} from "@/shared/lib/utils/data-validate.util";
import PieChart from "@/shared/components/pie";
import Subtitle from "@/shared/components/subtitle";

const MaterialsPanel: FC = () => {
  const { statsData } = useAdminMaterials();
  const [pieTypeData, setPieTypeData] = useState([{ x: "No data", y: 0 }]);
  const [pieStatusData, setPieStatusData] = useState([{ x: "No data", y: 0 }]);

  useEffect(() => {
    setPieTypeData(validateTypesData(statsData));
    setPieStatusData(validateStatusesData(statsData));
  }, [statsData]);

  console.log("DATA: ", pieStatusData);

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
