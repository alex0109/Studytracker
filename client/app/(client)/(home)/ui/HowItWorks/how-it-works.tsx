"use client";

import { FC, KeyboardEvent, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { howItWorksSteps } from "./data";

export const HowItWorks: FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = howItWorksSteps[activeIndex];
  const isLast = activeIndex === howItWorksSteps.length - 1;

  const selectTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  // Arrow keys move between tabs, like native tab widgets
  const onTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = howItWorksSteps.length;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      selectTab((activeIndex + 1) % count);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      selectTab((activeIndex - 1 + count) % count);
    }
  };

  return (
    <section
      id="how-it-works"
      className="flex w-full max-w-6xl scroll-mt-28 flex-col gap-12 px-4"
    >
      <Reveal>
        <SectionHeading
          eyebrow={t("landing.how.eyebrow")}
          title={t("landing.how.title")}
          text={t("landing.how.text")}
        />
      </Reveal>

      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div
            role="tablist"
            aria-label={t("landing.how.tabsLabel")}
            aria-orientation="vertical"
            onKeyDown={onTabsKeyDown}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {howItWorksSteps.map((step, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={step.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`how-tab-${step.id}`}
                  aria-selected={isActive}
                  aria-controls={`how-panel-${step.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left font-medium transition-colors",
                    isActive
                      ? "text-neutral-900 dark:text-neutral-50"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="how-it-works-active"
                      className="absolute inset-0 rounded-2xl bg-white shadow-md dark:bg-neutral-800"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative flex size-8 items-center justify-center rounded-xl text-sm transition-colors",
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                        : "bg-white/70 text-neutral-500 dark:bg-neutral-900/70 dark:text-neutral-400",
                    )}
                  >
                    <step.icon />
                  </span>
                  <span className="relative whitespace-nowrap">
                    {t(`landing.how.steps.${step.id}.label`)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`how-panel-${active.id}`}
            aria-labelledby={`how-tab-${active.id}`}
            className="min-h-[480px] rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur md:p-8 dark:border-neutral-800 dark:bg-neutral-900/80"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-sm text-neutral-400">
                    {t("landing.how.stepOf", {
                      step: activeIndex + 1,
                      total: howItWorksSteps.length,
                    })}
                  </span>
                  <h3 className="text-2xl! font-semibold! text-neutral-900 dark:text-neutral-50">
                    {t(`landing.how.steps.${active.id}.title`)}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t(`landing.how.steps.${active.id}.text`)}
                  </p>
                </div>

                <active.Demo />

                {!isLast && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    className="group inline-flex items-center gap-2 self-end text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  >
                    {t("landing.how.next", {
                      step: t(`landing.how.steps.${howItWorksSteps[activeIndex + 1].id}.label`),
                    })}
                    <LuArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
