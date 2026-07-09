import { FC } from "react";
import { BlockColumn, Title, Subtitle } from "@/shared/ui";

const TrafficPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Traffic" />
        <Subtitle text="Place for Google Analytics" />
      </BlockColumn>
    </div>
  );
};

export default TrafficPanel;
