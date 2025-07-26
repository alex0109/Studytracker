"use client";

import React from "react";
import TypeText from "./type-text.component";
import { TypeTextType } from "../types/type-text.types";
import { useForm } from "react-hook-form";
import Block from "./block";

const config: TypeTextType = {
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nulla a quod aliquid provident modi maxime eius autem ad quo veniam laudantium ipsa similique odit dicta, impedit est aperiam molestias.",
  typeSpeed: 60,
};

function Intro() {
  const { watch } = useForm();
  const promts = watch("promt");
  return (
    <Block>
      <div className="w-[800px]">
        <h1 className="text-gray-950 dark:text-white text-2xl font-bold text-center">
          Studytracker
        </h1>
        <div>
          {!promts ? (
            <TypeText text={config.text} typeSpeed={config.typeSpeed} />
          ) : (
            promts
          )}
        </div>
      </div>
    </Block>
  );
}

export default Intro;
