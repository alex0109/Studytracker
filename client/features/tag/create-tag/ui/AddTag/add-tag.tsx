"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Title, Modal, CustomInput } from "@/shared/ui";
import { ITagCreate } from "@/entities/tag";
import { useTagCreate } from "../../hooks/useTagCreate";
import { ColorPicker } from "../ColorPicker/color-picker";
import { Button } from "@/shared/radix-ui";

export const AddTag: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ITagCreate>();

  const { createTag } = useTagCreate();

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#64748B");

  const onFormSubmit = (values: ITagCreate) => {
    createTag({
      ...values,
      color,
    });
    setOpen(false);
    reset();
  };

  return (
    <>
      {/* <div
        onClick={() => setOpen(true)}
        className="relative w-10 h-10 rounded-4xl bg-neutral-900 hover:bg-neutral-700 text-neutral-600 text-2xl text-center cursor-pointer"
      >
        <span className="absolute top-0.5 left-[33%] text-white">+</span>
      </div> */}

      <Button onClick={() => setOpen(true)}>New Tag</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[400px]">
          <Title text="Add new tag" />
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <CustomInput
              label="Name"
              placeholder="*Name..."
              inputBlockStyles="my-5"
              {...register<"name">("name", { required: "Required" })}
              error={errors.name?.message}
            />
            <ColorPicker onChange={setColor} />
            <div className="flex w-full justify-center items-center my-5">
              <Button
                size="lg"
                className="w-30"
                type="submit"
                onClick={() => setOpen(true)}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
