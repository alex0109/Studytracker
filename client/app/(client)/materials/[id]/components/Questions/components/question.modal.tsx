import { IQuestion } from "@/app/types/question/question.type";
import CustomInput from "@/shared/components/input";
import Modal from "@/shared/components/modal";
import TextArea from "@/shared/components/text-area";
import Title from "@/shared/components/title";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface QuestionModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  createQuestion: (body: Partial<IQuestion>) => void;
}

const QuestionModal: FC<QuestionModalProps> = ({
  open,
  setOpen,
  createQuestion,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IQuestion>();

  const onFormSubmit = (values: IQuestion) => {
    createQuestion(values);
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

export default QuestionModal;
