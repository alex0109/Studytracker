import { FC } from "react";
import { LuArrowRight, LuRepeat } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { loopSteps } from "./data";

export const KnowledgeLoop: FC = () => {
  return (
    <section className="flex w-full max-w-6xl flex-col gap-12 px-4">
      <Reveal>
        <SectionHeading
          eyebrow="The idea"
          title="One loop. Three verbs."
          text="Notes alone fade. Studytracker keeps knowledge moving through a loop that grows it, reinforces it and makes it stronger every time you come back."
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {loopSteps.map((step, index) => (
          <Reveal key={step.verb} className="relative h-full">
            <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div
                aria-hidden
                className={cn(
                  "absolute -right-16 -top-16 size-48 rounded-full bg-linear-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                  step.styles.glow,
                )}
              />
              <div className="relative flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl text-xl shadow-lg",
                    step.styles.icon,
                  )}
                >
                  <step.icon />
                </span>
                <span className="font-mono text-sm text-neutral-300">
                  0{index + 1}
                </span>
              </div>
              <h3 className="relative text-2xl! font-semibold! text-neutral-900">
                {step.verb}
              </h3>
              <p className="relative text-neutral-600">{step.text}</p>
              <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
                {step.entities.map((entity) => (
                  <span
                    key={entity}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      step.styles.chip,
                    )}
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </article>
            {index < loopSteps.length - 1 && (
              <LuArrowRight
                aria-hidden
                className="absolute -right-4 top-1/2 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-white p-1 text-neutral-400 shadow md:block"
              />
            )}
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mx-auto flex max-w-xl items-center justify-center gap-2 text-center text-sm text-neutral-500">
          <LuRepeat className="shrink-0" />
          Weak spots from Strengthen become the next things you Grow. The loop
          never stops, and neither does your progress.
        </p>
      </Reveal>
    </section>
  );
};
