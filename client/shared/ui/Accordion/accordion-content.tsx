import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import { cn } from "@/shared/lib";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "./styles.module.css";
import { Separator } from "@/shared/radix-ui";
import { motion } from "framer-motion";

interface AccordionContentProps extends ComponentPropsWithoutRef<
  typeof Accordion.Content
> {
  actions?: ReactNode;
  isOpen: boolean;
}

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, actions, isOpen, ...props }, forwardedRef) => (
  <Accordion.Content forceMount asChild {...props}>
    <motion.div
      ref={forwardedRef}
      className={cn(styles.Content, className)}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { height: "auto", opacity: 1 },
        closed: { height: 0, opacity: 0 },
      }}
      transition={{ duration: 0.3, ease: [0.87, 0, 0.13, 1] }}
    >
      <div className="px-5 py-[15px] wrap-break-word">{children}</div>
      {actions && (
        <div className="flex justify-end items-center p-2 pr-10">{actions}</div>
      )}
      <Separator />
    </motion.div>
  </Accordion.Content>
));
