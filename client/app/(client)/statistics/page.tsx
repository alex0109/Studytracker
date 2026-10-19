import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { StatisticsDashboard } from "@/entities/statistics/ui";

const Statistics: FC = () => {
  return (
    <BlockColumn>
      <Title text="Statistics" />
      <StatisticsDashboard />
    </BlockColumn>
  );
};

export default Statistics;
