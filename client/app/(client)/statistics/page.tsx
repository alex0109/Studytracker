import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { StatisticalChart } from "@/entities/material/ui";
import { StatisticsDashboard } from "@/entities/statistics/ui";

const Statistics: FC = () => {
  return (
    <BlockColumn>
      <Title text="Statistics" />
      {/* <StatisticalChart /> */}
      <StatisticsDashboard />
    </BlockColumn>
  );
};

export default Statistics;
