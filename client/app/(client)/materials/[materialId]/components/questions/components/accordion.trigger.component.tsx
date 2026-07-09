import { forwardRef } from "react";
import styles from "./../styles.module.css";
import { LuChevronsDown } from "react-icons/lu";
import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/shared/lib/cn.util";

const AccordionTrigger = forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => (
    <Accordion.Header className={styles.Header}>
      <Accordion.Trigger
        className={cn(styles.Trigger, className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <div className="flex justify-center items-start h-full pt-2">
          <LuChevronsDown className={styles.Chevron} aria-hidden />
        </div>
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

export default AccordionTrigger;
