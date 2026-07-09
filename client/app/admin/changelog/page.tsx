import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";

const ChangelogPanel: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Changelog" />
      </BlockColumn>
    </div>
  );
};

export default ChangelogPanel;
