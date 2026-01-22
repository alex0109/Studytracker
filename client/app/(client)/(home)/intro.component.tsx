"use client";

import React, { FC } from "react";

import { TypeTextType } from "./types";
import BlockColumn from "../../../shared/components/block-column";
import ContainerColumn from "@/shared/components/container-column";
import TypeText from "./components/type-text.component";

const config: TypeTextType = {
  text: "Keep it simple. Keep it productive.",
  typeSpeed: 60,
};

const Intro: FC = () => {
  return (
    <BlockColumn>
      <ContainerColumn>
        <h1>Studytracker</h1>

        <div>
          <TypeText text={config.text} typeSpeed={config.typeSpeed} />
        </div>
      </ContainerColumn>
    </BlockColumn>
  );
};

export default Intro;
