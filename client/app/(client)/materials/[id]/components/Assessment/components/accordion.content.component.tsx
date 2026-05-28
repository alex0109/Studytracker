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
      <div className={styles.ContentText}>{children}</div>
    </Accordion.Content>
  ),
);

export default AccordionContent;
