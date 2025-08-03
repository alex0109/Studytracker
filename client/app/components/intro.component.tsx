"use client";

import React from "react";
import TypeText from "./type-text.component";
import { TypeTextType } from "../types/type-text.types";
import BlockColumn from "../../shared/components/block-column";
import Title from "@/shared/components/title";

const config: TypeTextType = {
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nulla a quod aliquid provident modi maxime eius autem ad quo veniam laudantium ipsa similique odit dicta, impedit est aperiam molestias.",
  typeSpeed: 60,
};

function Intro() {
  return (
    <BlockColumn>
      <div className="w-[800px] h-[150px]">
        <Title text="Studytracker" />
        <div>
          <TypeText text={config.text} typeSpeed={config.typeSpeed} />
        </div>
      </div>
    </BlockColumn>
  );
}

export default Intro;
