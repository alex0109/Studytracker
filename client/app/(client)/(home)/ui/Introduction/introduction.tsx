import { FC } from "react";
import { BlockColumn, ContainerColumn, TypeText, ITypeText } from "@/shared/ui";

const config: ITypeText = {
  text: "Converts learning from passive information storage into a measurable feedback system.",
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
