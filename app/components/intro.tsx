"use client";

import React from "react";
import { useForm } from "react-hook-form";

function Intro() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const promts = watch("promt");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-neutral-800 rounded-xl w-[1000px] h-[600px] border-3 border-gray-50 dark:border-neutral-700 flex flex-col items-center justify-between">
      <div className="w-[800px]">
        <h1 className="text-gray-950 dark:text-white text-2xl font-bold text-center">
          Intro
        </h1>
        {!promts ? (
          <p className="text-gray-700 dark:text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            nulla a quod aliquid provident modi maxime eius autem ad quo veniam
            laudantium ipsa similique odit dicta, impedit est aperiam molestias.
          </p>
        ) : (
          promts
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col bg-gray-50 dark:bg-neutral-700 rounded-4xl p-5 w-[750px] h-[150px]">
          <textarea
            id="promt"
            className="resize-none h-[125px]"
            placeholder="Type in your mood..."
            {...register("promt", { required: "Promt is required" })}
          />
          <button
            type="submit"
            className="h-[25px] text-violet-800 hover:text-violet-900 dark:text-neutral-100 hover:dark:text-neutral-200 cursor-pointer font-semibold self-end duration-200"
            disabled={!errors.promt && false}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Intro;
