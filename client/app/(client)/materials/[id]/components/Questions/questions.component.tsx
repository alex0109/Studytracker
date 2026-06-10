import { FC, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import BlockColumn from "@/shared/components/block-column";
import styles from "./styles.module.css";
import { Button } from "@/shared/components/ui/button";
import { questionInterface } from "../../lib/data/data";
import { cn } from "@/shared/lib/utils";
import { IQuestion } from "@/app/types/question/question.type";
import { Separator } from "@/shared/components/ui/separator";
import QuestionTitle from "./components/question.title.component";
import QuestionAnswer from "./components/question.answer.component";
import QuestionModal from "./components/question.modal";
import { useRouter, usePathname } from "next/navigation";
import ContainerRow from "@/shared/components/container-row";

interface QuestionsType {
  questions: IQuestion[] | undefined;
  createQuestion: (body: Partial<IQuestion>) => void;
  deleteQuestion: (id: string) => void;
}

const Questions: FC<QuestionsType> = ({
  questions,
  createQuestion,
  deleteQuestion,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const onClickhandlers = {
    "open-modal": () => setOpen(true),
    generate: () => alert("Not working"),
    start: () => router.push(`${path}/assessment`),
  };

  const disabledHandlers = {
    "open-modal": false,
    generate: false,
    start: questions && questions.length > 0 ? false : true,
  };

  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <div className="w-full flex justify-between items-center mb-5">
        {questionInterface.map((item) => (
          <Button
            key={item.key}
            onClick={onClickhandlers[item.key]}
            disabled={disabledHandlers[item.key]}
            className={`w-[200px] ${cn(item.styles)}`}
          >
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      <Separator />
      {questions && questions.length > 0 ? (
        <Accordion.Root
          className={styles.Root}
          type="single"
          defaultValue="item-1"
          collapsible
        >
          {questions.map((item) => (
            <Accordion.Item
              key={item.id}
              className={styles.Item}
              value={item.id}
            >
              <QuestionTitle
                materialId={item.materialId}
                id={item.id}
                title={item.title}
              />
              <QuestionAnswer
                materialId={item.materialId}
                id={item.id}
                answer={item.answer}
                deleteQuestion={deleteQuestion}
              />
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <ContainerRow blockStyles="justify-center items-center">
          <p className="text-neutral-500 text-lg">
            There is no questions yet...
          </p>
        </ContainerRow>
      )}
      <QuestionModal
        open={open}
        setOpen={setOpen}
        createQuestion={createQuestion}
      />
    </BlockColumn>
  );
};

export default Questions;
