import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./reveal.module.css";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Fades content in while it scrolls into view, driven by CSS scroll timeline
export const Reveal: FC<RevealProps> = ({ children, className }) => {
  return <div className={cn(styles.reveal, className)}>{children}</div>;
};
