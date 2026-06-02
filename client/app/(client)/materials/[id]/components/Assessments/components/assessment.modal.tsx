import { IAssessment } from "@/app/types/assessment/assessment.type";
import CustomInput from "@/shared/components/input";
import Modal from "@/shared/components/modal";
import TextArea from "@/shared/components/text-area";
import Title from "@/shared/components/title";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import React, { FC } from "react";
import { useForm } from "react-hook-form";

interface AssessmentModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  createAssessment: (body: Partial<IAssessment>) => void;
}

const AssessmentModal: FC<AssessmentModalProps> = ({
  open,
  setOpen,
  createAssessment,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IAssessment>();

  const onFormSubmit = (values: IAssessment) => {
    createAssessment(values);
    setOpen(false);
    reset();
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="w-dvh h-[600px]">
        <Title text="Add new Assessment" />
        <Separator />
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="justify-center items-center"
        >
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
            placeholder="*Type your answer to assessment here but remember 1000 symbols max..."
            maxLength={1000}
            {...register<"answer">("answer", {
              required: "Required",
            })}
            error={errors.answer?.message}
          />
          <Button type="submit" onClick={() => setOpen(true)}>
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AssessmentModal;
