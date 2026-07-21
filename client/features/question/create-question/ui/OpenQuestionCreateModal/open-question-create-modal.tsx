import { FC } from "react";
import { useForm } from "react-hook-form";
import { IOpenQuestionRequest } from "@/entities/question";
import {
  CustomInput,
  IsPendingLoader,
  Modal,
  TextArea,
  Title,
} from "@/shared/ui";
import { Button, Separator } from "@/shared/radix-ui";
import { useOpenQuestionCreate } from "../../hooks/useOpenQuestionCreate";

interface QuestionCreateModalProps {
  materialId: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const OpenQuestionCreateModal: FC<QuestionCreateModalProps> = ({
  materialId,
  open,
  setOpen,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IOpenQuestionRequest>();

  const { createOpenQuestion, createOpenQuestionIsPending } =
    useOpenQuestionCreate(materialId);

  const onFormSubmit = (values: IOpenQuestionRequest) => {
    createOpenQuestion(values);
    setOpen(false);
    reset();
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="w-dvh h-[600px]">
        <div className="flex flex-col w-full justify-center">
          <Title text="Add new Question" />
          <Separator />
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
            <CustomInput
              label="Title"
              inputBlockStyles="text-center"
              placeholder="*Title..."
              maxLength={50}
              {...register<"title">("title", {
                required: "Required",
              })}
              error={errors.title?.message}
            />
            <div className="flex flex-col justify-center">
              <select
                {...register("questionDifficulty")}
                className="bg-gray-50 dark:bg-neutral-700 p-2 m-2 rounded-2xl"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <TextArea
              label="Answer"
              inputStyles="h-[300px] p-5"
              placeholder="*Type your answer to Question here but remember 1000 symbols max..."
              maxLength={1000}
              {...register<"answer">("answer", {
                required: "Required",
              })}
              error={errors.answer?.message}
            />
            <div className="flex w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex flex-1 justify-center items-center">
                <Button
                  size="lg"
                  className="w-50"
                  type="submit"
                  onClick={() => setOpen(true)}
                >
                  Create
                </Button>
              </div>
              <div className="flex-1">
                <IsPendingLoader isPending={createOpenQuestionIsPending} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
