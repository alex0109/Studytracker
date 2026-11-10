import { FC, ReactNode } from "react";

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The word in the sentence, with the endings it takes there ("hund" in "hunden")
export const HighlightTerm: FC<{ sentence: string; term: string }> = ({ sentence, term }) => {
  const stem = term.trim();
  if (stem.length < 2) return <>{sentence}</>;

  const match = new RegExp(`${escape(stem)}[\\p{L}\\p{M}'-]*`, "iu").exec(sentence);
  if (!match) return <>{sentence}</>;

  const parts: ReactNode[] = [
    sentence.slice(0, match.index),
    <mark key="term" className="rounded bg-violet-100 px-0.5 font-semibold text-violet-800 dark:bg-violet-950/70 dark:text-violet-200">
      {match[0]}
    </mark>,
    sentence.slice(match.index + match[0].length),
  ];

  return <>{parts}</>;
};
