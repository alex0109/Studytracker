"use client";

import { FC } from "react";
import BlockColumn from "@/shared/components/block-column";
import Title from "@/shared/components/title";

const DocsPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Docs" />
      </BlockColumn>
    </div>
  );
};

export default DocsPanel;
