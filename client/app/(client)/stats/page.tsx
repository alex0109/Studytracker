import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";
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
