"use client";

import React from "react";
import TypeText from "./type-text.component";
import { TypeTextType } from "../types/type-text.types";
import CustomForm from "./form.component";
import { useForm } from "react-hook-form";

const config: TypeTextType = {
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nulla a quod aliquid provident modi maxime eius autem ad quo veniam laudantium ipsa similique odit dicta, impedit est aperiam molestias.",
  typeSpeed: 60,
};

function Intro() {
  const { watch } = useForm();
  const promts = watch("promt");
  return (
    <div className="p-8 bg-gray-100 dark:bg-neutral-800 rounded-xl w-[1000px] h-[600px] border-3 border-gray-50 dark:border-neutral-700 flex flex-col items-center justify-between">
      <div className="w-[800px]">
        <h1 className="text-gray-950 dark:text-white text-2xl font-bold text-center">
          Synaesthetic
        </h1>
        <div>
          {!promts ? (
            <TypeText text={config.text} typeSpeed={config.typeSpeed} />
          ) : (
            promts
          )}
        </div>
      </div>
      <CustomForm />
    </div>
  );
}

export default Intro;
