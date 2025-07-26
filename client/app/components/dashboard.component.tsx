"use client";

import { useForm } from "react-hook-form";
import Block from "./block";
import { CustomInput } from "./input";
import CustomButton from "./button";

enum MaterialStatus {
  tolearn = "tolearn",
  inprocess = "inprocess",
  learnt = "learnt",
}

interface CustomFormInterface {
  title: string;
  type: string;
  link: string;
  tag: string;
  status: MaterialStatus;
}

const Dashboard = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CustomFormInterface>();

  const onFormSubmit = (values: CustomFormInterface) => {
    console.log(values);
  };

  return (
    <Block>
      <h1>Create goal</h1>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="justify-center items-center"
      >
        <CustomInput
          label="Title"
          placeholder="Title..."
          {...register<"title">("title", {})}
          error={errors.title?.message}
        />
        <CustomInput
          label="Type"
          placeholder="Type..."
          {...register<"type">("type", {})}
          error={errors.type?.message}
        />
        <CustomInput
          label="Link"
          placeholder="Link..."
          {...register<"link">("link", {})}
          error={errors.link?.message}
        />
        <CustomInput
          label="Tag"
          placeholder="Tag..."
          {...register<"tag">("tag", {})}
          error={errors.tag?.message}
        />
        <div className="flex gap-2 flex-col justify-center">
          <label className="border-l-1 border-black dark:border-white px-2">
            Status
          </label>
          <select
            {...register("status")}
            className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
          >
            <option value="tolearn">Want to learn</option>
            <option value="inprocess">In process</option>
            <option value="learnt">Learnt</option>
          </select>
        </div>

        <CustomButton title="Submit" type="submit" />
      </form>
    </Block>
  );
};

export default Dashboard;
