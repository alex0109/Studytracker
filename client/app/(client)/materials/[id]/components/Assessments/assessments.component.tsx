import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as Accordion from "@radix-ui/react-accordion";
import BlockColumn from "@/shared/components/block-column";
import AccordionTrigger from "./components/accordion.trigger.component";
import AccordionContent from "./components/accordion.content.component";
import styles from "./styles.module.css";
import { Button } from "@/shared/components/ui/button";
import { assessmentInterface } from "../../lib/data/data";
import { cn } from "@/shared/lib/utils";
import { IAssessment } from "@/app/types/assessment/assessment.type";
import { Separator } from "@/shared/components/ui/separator";
import Modal from "@/shared/components/modal";
import CustomInput from "@/shared/components/input";
import Title from "@/shared/components/title";

import TextArea from "@/shared/components/text-area";
import { Input } from "@/shared/components/ui/input";

interface AssessmentsType {
  assessments: IAssessment[] | undefined;
  createAssessment: (body: Partial<IAssessment>) => void;
  editAssessment: (id: string, dataToUpdate: Partial<IAssessment>) => void;
  deleteAssessment: (id: string) => void;
}

const Assessments: FC<AssessmentsType> = ({
  assessments,
  createAssessment,
  editAssessment,
  deleteAssessment,
}) => {
  const [open, setOpen] = useState(false);

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

  const handlers = {
    "open-modal": () => setOpen(true),
    generate: () => alert("Not working"),
    start: () => alert("Not working"),
  };

  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <div className="w-full flex justify-between items-center mb-5">
        {assessmentInterface.map((item) => (
          <Button
            key={item.key}
            onClick={handlers[item.key]}
            className={`w-[200px] ${cn(item.styles)}`}
          >
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      <Separator />
      {assessments ? (
        <Accordion.Root
          className={styles.Root}
          type="single"
          defaultValue="item-1"
          collapsible
        >
          {assessments.map((item) => (
            <Accordion.Item
              key={item.id}
              className={styles.Item}
              value={item.id}
            >
              <AccordionTrigger>
                {/* <Input
                  value={item.title}
                  className=" bg-amber-300 focus:outline-none text-2xl font-bold border-0 w-full wrap-break-word"
                  onChange={() => console.log("")}
                /> */}
                <textarea
                  value={item.title}
                  className="text-2xl font-bold border-0 w-full resize-none 
                  wrap-break-word overflow-hidden outline-none leading-8"
                  onChange={() => console.log("")}
                />
              </AccordionTrigger>
              <AccordionContent
                deleteAssessment={() => deleteAssessment(item.id)}
                editAssessment={() => console.log("")}
              >
                {item.answer}
              </AccordionContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : null}
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
              inputStyles="h-[300px]"
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
    </BlockColumn>
  );
};

export default Assessments;
