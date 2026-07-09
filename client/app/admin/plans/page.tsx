import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";

const PlansPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Plans" />
      </BlockColumn>
    </div>
  );
};

export default PlansPanel;
