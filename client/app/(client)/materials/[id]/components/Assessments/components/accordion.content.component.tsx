import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "./../styles.module.css";

const AccordionContent = forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Content
      className={cn(styles.Content, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-[20px] py-[20px] wrap-break-word">{children}</div>
    </Accordion.Content>
  ),
);

export default AccordionContent;
