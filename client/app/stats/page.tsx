"use client";

import BlockColumn from "@/shared/components/block-column";
import ContainerColumn from "@/shared/components/container-column";
import PieChart from "@/shared/components/pie";
import Subtitle from "@/shared/components/subtitle";
import Title from "@/shared/components/title";
import { useEffect, useState } from "react";
import useMaterials from "../materials/hooks/useMaterials.hook";
import {
  validateStatusesData,
  validateTypesData,
} from "./utils/data-validate.util";

export default function Stats() {
  const [pieTypeData, setPieTypeData] = useState([{ x: "No data", y: 0 }]);
  const [pieStatusData, setPieStatusData] = useState([{ x: "No data", y: 0 }]);
  const { statsData } = useMaterials();

  useEffect(() => {
    setPieTypeData(validateTypesData(statsData));
    setPieStatusData(validateStatusesData(statsData));
  }, [statsData]);

  return (
    <BlockColumn>
      <Title text="Statistics" />
      <ContainerColumn blockStyles="justify-center">
        <Subtitle text="Status" />
        <div className="w-full border-b-1 border-b-neutral-700">
          <PieChart chartData={pieTypeData} />
        </div>
        <Subtitle text="Type" />
        <div className="w-full">
          <PieChart chartData={pieStatusData} />
        </div>
      </ContainerColumn>
    </BlockColumn>
  );
}
