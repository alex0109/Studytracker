import { FC } from "react";
import { BlockColumn, ContainerColumn, TypeText, ITypeText } from "@/shared/ui";

const config: ITypeText = {
  text: "Keep it simple. Keep it productive.",
  typeSpeed: 60,
};

export const Introduction: FC = () => {
  return (
    <BlockColumn>
      <ContainerColumn blockStyles="justify-center items-center">
        <h1>Studytracker</h1>
        <div>
          <TypeText text={config.text} typeSpeed={config.typeSpeed} />
        </div>
      </ContainerColumn>
    </BlockColumn>
  );
};
