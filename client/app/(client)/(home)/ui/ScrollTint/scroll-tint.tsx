import { FC } from "react";
import { cn } from "@/shared/lib";
import styles from "./scroll-tint.module.css";

export const ScrollTint: FC = () => {
  return (
    <div aria-hidden className={styles.tint}>
      <div className={cn(styles.layer, styles.grow)} />
      <div className={cn(styles.layer, styles.reinforce)} />
      <div className={cn(styles.layer, styles.strengthen)} />
    </div>
  );
};
