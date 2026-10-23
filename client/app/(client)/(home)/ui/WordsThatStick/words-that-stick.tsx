import { FC } from "react";
import { LuArrowDown, LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { FlashcardsDemo } from "./flashcards-demo";

const RULES = [
  {
    icon: LuArrowLeft,
    swipe: "Don't know",
    result: "comes back in a minute",
    styles: "bg-red-100 text-red-600",
  },
  {
    icon: LuArrowDown,
    swipe: "Not sure",
    result: "comes back tomorrow",
    styles: "bg-amber-100 text-amber-600",
  },
  {
    icon: LuArrowRight,
    swipe: "Know",
    result: "waits a few days, then longer and longer",
    styles: "bg-emerald-100 text-emerald-700",
  },
];

export const WordsThatStick: FC = () => {
  return (
    <section className="grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
      <Reveal className="flex flex-col gap-8">
        <SectionHeading
          align="left"
          eyebrow="Dictionaries & flashcards"
          title="Words that stick."
          text="Every material can have its own dictionary: words with translation, transcription, part of speech, examples and synonyms. Flashcards bring them back right before you would forget them."
        />
        <ul className="flex flex-col gap-3">
          {RULES.map((rule) => (
            <li
              key={rule.swipe}
              className="flex items-center gap-3 rounded-2xl border border-white bg-white/70 p-3 backdrop-blur"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  rule.styles,
                )}
              >
                <rule.icon />
              </span>
              <span className="text-neutral-700">
                <span className="font-semibold text-neutral-900">
                  {rule.swipe}
                </span>{" "}
                {rule.result}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-neutral-500">
          Every swipe is saved, so progress survives closing the tab. Your
          time goes to the words you actually struggle with.
        </p>
      </Reveal>

      <Reveal>
        <FlashcardsDemo />
      </Reveal>
    </section>
  );
};
