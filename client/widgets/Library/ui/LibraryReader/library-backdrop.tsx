import { cn } from "@/shared/lib/cn";
import styles from "./library-reader.module.css";

// Covers the site-wide colour washes, which end after the first screen of a long page
export const LibraryBackdrop = () => (
  <div aria-hidden className={cn(styles.Backdrop, "pointer-events-none fixed inset-0 -z-10")} />
);
