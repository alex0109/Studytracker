import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "./../styles.module.css";
import { Button } from "@/shared/components/ui/button";
import { LuTrash2 } from "react-icons/lu";
import { Separator } from "@/shared/components/ui/separator";

const AccordionContent = forwardRef(
  ({ children, className, deleteQuestion, ...props }: any, forwardedRef) => (
    <Accordion.Content
      className={cn(styles.Content, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-5 wrap-break-word">{children}</div>
      <div className="flex justify-end items-center p-2 pr-10">
        <Button variant="destructive" onClick={deleteQuestion}>
          <LuTrash2 />
        </Button>
      </div>
      <Separator />
    </Accordion.Content>
  ),
);

export default AccordionContent;
