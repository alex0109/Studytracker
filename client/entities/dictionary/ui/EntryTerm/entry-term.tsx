import { FC } from "react";
import { cn } from "@/shared/lib";

interface EntryTermProps {
  term: string;
  // A noun's article, shown in front of it and quieter
  article?: string | null;
  className?: string;
}

// "der Hund": the word as it is learnt
export const EntryTerm: FC<EntryTermProps> = ({ term, article, className }) => (
  <span className={cn(className)}>
    {article && <span className="font-normal text-neutral-500 dark:text-neutral-400">{article} </span>}
    {term}
  </span>
);
