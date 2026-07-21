import { forwardRef } from "react";
import { cn } from "@/shared/lib";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "./styles.module.css";
import { Button, Separator } from "@/shared/radix-ui";
import { LuTrash2 } from "react-icons/lu";

export const AccordionContent = forwardRef(
  ({ children, className, deleteQuestion, ...props }: any, forwardedRef) => (
    <Accordion.Content
      className={cn(styles.Content, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-5 wrap-break-word">{children}</div>
      <div className="flex justify-end items-center p-2 pr-10">
        <Button size="lg" variant="destructive" onClick={deleteQuestion}>
          <LuTrash2 />
        </Button>
      </div>
      <Separator />
    </Accordion.Content>
  ),
);
