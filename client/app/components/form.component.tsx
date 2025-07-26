import React from "react";
import { useForm } from "react-hook-form";

function CustomForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
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
  );
}

export default CustomForm;
