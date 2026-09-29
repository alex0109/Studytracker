"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Title, Modal, CustomInput, IsPendingLoader } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { LuPlus } from "react-icons/lu";
import { INoteCreate } from "@/entities/note/model";
import { useNoteCreate } from "../../hooks/useNoteCreate";

interface AddNoteModalProps {
  materialId: string;
}

export const AddNoteModal: FC<AddNoteModalProps> = ({ materialId }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<INoteCreate>();

  const [open, setOpen] = useState(false);
  const { createNote, createNoteIsPending } = useNoteCreate(materialId);

  const onFormSubmit = (values: INoteCreate) => {
    setOpen(false);
    createNote(values);
    reset();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="w-full flex justify-start items-center hover:bg-neutral-900/10 px-3"
      >
        <div>
          <LuPlus />
        </div>
        <div>
          <p>Add Note</p>
        </div>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="md:w-[400px] w-[300px]">
          <Title text="Add new note" />
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col w-full justify-center items-center"
          >
            <div className="w-full">
              <CustomInput
                label="Title"
                placeholder="*Title..."
                {...register<"title">("title", { required: "Required" })}
                error={errors.title?.message}
              />
            </div>
            <div className="flex gap-2 flex-col justify-center">
              <select
                {...register("type")}
                className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                <option value="text">✍️ Text</option>
                <option value="drawing">🖌️ Drawing</option>
              </select>
            </div>
            <div className="flex w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex-1 my-5">
                <Button
                  size="lg"
                  type="submit"
                  className="w-30"
                  disabled={createNoteIsPending}
                >
                  Create
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={createNoteIsPending} />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
