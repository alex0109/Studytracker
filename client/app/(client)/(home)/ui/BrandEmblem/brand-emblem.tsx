import { FC } from "react";
import { cn } from "@/shared/lib";
import styles from "./brand-emblem.module.css";

interface BrandEmblemProps {
  className?: string;
  label?: string;
  // On a dark block in a light page the soft colours of the dark theme read better
  onDark?: boolean;
}

// The laurel monogram, large: a wreath for knowledge that was defended
export const BrandEmblem: FC<BrandEmblemProps> = ({ className, label = "Studytracker", onDark = false }) => (
  <div className={cn("relative size-32 md:size-40", onDark && styles.onDark, className)}>
    <div aria-hidden className={cn("absolute -inset-6 rounded-full", styles.glow)} />
    <div role="img" aria-label={label} className={cn("relative size-full", styles.emblem)} />
  </div>
);
