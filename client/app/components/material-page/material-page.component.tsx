import ProgressBadge from "@/shared/components/progress-badge";
import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import React from "react";
import Subtitle from "@/shared/components/subtitle";

const MaterialPage = () => {
  return (
    <>
      <BlockColumn>
        <Title text="Name" blockStyles="my-0" />
        <Text text="Type" />
      </BlockColumn>
      <BlockColumn blockStyles="p-[70px] items-start">
        <div>
          <span className="italic">Tag</span>
          <Text text="tag" textStyles="pl-5" />
        </div>
        <div>
          <span className="italic">Link</span>
          <Text text="tag" textStyles="pl-5" />
        </div>
        <div>
          <span className="italic">Status</span>
          <ProgressBadge status="inprocess" value="In process" />
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialPage;
