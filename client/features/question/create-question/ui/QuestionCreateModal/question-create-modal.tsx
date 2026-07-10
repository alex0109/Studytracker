import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  IOpenQuestionRequest,
  IOptionsQuestionRequest,
} from "@/entities/question";
import { CustomInput, Modal, TextArea, Title } from "@/shared/ui";
import { Button, Separator } from "@/shared/radix-ui";

interface QuestionCreateModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  createOpenQuestion: (body: IOpenQuestionRequest) => void;
  createOptionsQuestion: (body: IOptionsQuestionRequest) => void;
}

export const QuestionCreateModal: FC<QuestionCreateModalProps> = ({
  open,
  setOpen,
  createOpenQuestion,
  createOptionsQuestion,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IOpenQuestionRequest>();

  const onFormSubmit = (values: IOpenQuestionRequest) => {
    // createOpenQuestion(values);
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
            <Button
              className="self-end"
              type="submit"
              onClick={() => setOpen(true)}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
