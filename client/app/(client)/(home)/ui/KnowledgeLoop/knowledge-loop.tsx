"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { LuArrowRight, LuRepeat } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { loopSteps } from "./data";

export const KnowledgeLoop: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex w-full max-w-6xl flex-col gap-12 px-4">
      <Reveal>
        <SectionHeading
          eyebrow={t("landing.loop.eyebrow")}
          title={t("landing.loop.title")}
          text={t("landing.loop.text")}
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {loopSteps.map((step, index) => (
          <Reveal key={step.key} className="relative h-full">
            <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/80">
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
                <span className="font-mono text-sm text-neutral-300 dark:text-neutral-600">
                  0{index + 1}
                </span>
              </div>
              <h3 className="relative text-2xl! font-semibold! text-neutral-900 dark:text-neutral-50">
                {t(`landing.loop.steps.${step.key}.verb`)}
              </h3>
              <p className="relative text-neutral-600 dark:text-neutral-400">
                {t(`landing.loop.steps.${step.key}.text`)}
              </p>
              <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
                {step.entities.map((entity) => (
                  <span
                    key={entity}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      step.styles.chip,
                    )}
                  >
                    {t(`landing.entities.${entity}`)}
                  </span>
                ))}
              </div>
            </article>
            {index < loopSteps.length - 1 && (
              <LuArrowRight
                aria-hidden
                className="absolute -right-4 top-1/2 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-white p-1 text-neutral-400 shadow md:block dark:bg-neutral-800"
              />
            )}
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mx-auto flex max-w-xl items-center justify-center gap-2 text-center text-sm text-neutral-500">
          <LuRepeat className="shrink-0" />
          {t("landing.loop.footer")}
        </p>
      </Reveal>
    </section>
  );
};
