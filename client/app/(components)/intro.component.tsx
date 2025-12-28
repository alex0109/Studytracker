"use client";

import React, { FC } from "react";
import TypeText from "./type-text.component";
import { TypeTextType } from "./types";
import BlockColumn from "../../shared/components/block-column";
import Title from "@/shared/components/title";
import ContainerColumn from "@/shared/components/container-column";

const config: TypeTextType = {
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nulla a quod aliquid provident modi maxime eius autem ad quo veniam laudantium ipsa similique odit dicta, impedit est aperiam molestias.",
  typeSpeed: 60,
};

const Intro: FC = () => {
  return (
    <BlockColumn>
      <ContainerColumn>
        <Title text="Studytracker" />
        <div>
          <TypeText text={config.text} typeSpeed={config.typeSpeed} />
        </div>
      </ContainerColumn>
    </BlockColumn>
  );
};

export default Intro;
