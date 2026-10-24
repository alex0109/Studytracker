import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { LimitsOverview } from "@/widgets/LimitsOverview";

const Limits: FC = () => {
  return (
    <BlockColumn>
      <Title text="Limits" />
      <LimitsOverview />
    </BlockColumn>
  );
};

export default Limits;
