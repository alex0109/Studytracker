"use client";

import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";
import Subtitle from "@/shared/components/subtitle";

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
