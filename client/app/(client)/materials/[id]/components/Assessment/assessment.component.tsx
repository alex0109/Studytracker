import * as Accordion from "@radix-ui/react-accordion";
import BlockColumn from "@/shared/components/block-column";
import AccordionTrigger from "./components/accordion.trigger.component";
import AccordionContent from "./components/accordion.content.component";
import styles from "./styles.module.css";
import { Button } from "@/shared/components/ui/button";
import { assessmentInterface, assessments } from "../../lib/data/data";
import { cn } from "@/shared/lib/utils";

const Assessment = () => {
  return (
    <BlockColumn blockStyles="p-[70px] items-start">
      <div className="w-full flex justify-between items-center">
        {assessmentInterface.map((item) => (
          <Button key={item.key} className={`w-[200px] ${cn(item.styles)}`}>
            {item.icon} {item.title}
          </Button>
        ))}
      </div>
      <Accordion.Root
        className={styles.Root}
        type="single"
        defaultValue="item-1"
        collapsible
      >
        {assessments.map((item) => (
          <Accordion.Item key={item.id} className={styles.Item} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </BlockColumn>
  );
};

export default Assessment;
