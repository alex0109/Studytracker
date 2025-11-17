"use client";

import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";

const MaterialsPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Materials" />
      </BlockColumn>
    </div>
  );
};

export default MaterialsPanel;
