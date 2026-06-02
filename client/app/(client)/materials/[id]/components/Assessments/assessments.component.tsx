import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import BlockColumn from "@/shared/components/block-column";
import styles from "./styles.module.css";
import { Button } from "@/shared/components/ui/button";
import { assessmentInterface } from "../../lib/data/data";
import { cn } from "@/shared/lib/utils";
import { IAssessment } from "@/app/types/assessment/assessment.type";
import { Separator } from "@/shared/components/ui/separator";
import AssessmentTitle from "./components/assessment.title.component";
import AssessmentAnswer from "./components/assessment.answer.component";
import AssessmentModal from "./components/assessment.modal";

interface AssessmentsType {
  assessments: IAssessment[] | undefined;
  createAssessment: (body: Partial<IAssessment>) => void;
  deleteAssessment: (id: string) => void;
}

const Assessments: FC<AssessmentsType> = ({
  assessments,
  createAssessment,
  deleteAssessment,
}) => {
  const [open, setOpen] = useState(false);

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
              <AssessmentTitle
                materialId={item.materialId}
                id={item.id}
                title={item.title}
              />
              <AssessmentAnswer
                materialId={item.materialId}
                id={item.id}
                answer={item.answer}
                deleteAssessment={deleteAssessment}
              />
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : null}
      <AssessmentModal
        open={open}
        setOpen={setOpen}
        createAssessment={createAssessment}
      />
    </BlockColumn>
  );
};

export default Assessments;
