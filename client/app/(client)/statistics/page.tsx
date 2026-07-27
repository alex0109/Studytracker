import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { StatisticalChart } from "@/entities/material/ui";

const Statistics: FC = () => {
  return (
    <BlockColumn>
      <Title text="Statistics" />
      <StatisticalChart />
    </BlockColumn>
  );
};

export default Statistics;
