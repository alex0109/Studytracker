import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import Chart from "./components/chart.component";

const Stats: FC = () => {
  return (
    <BlockColumn>
      <Title text="Statistics" />
      <Chart />
    </BlockColumn>
  );
};

export default Stats;
