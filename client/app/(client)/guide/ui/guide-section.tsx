"use client";

import { FC } from "react";
import { LuLightbulb, LuMapPin, LuMousePointerClick, LuSparkle } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../../(home)/ui/Reveal";
import { IGuideSection } from "./data";

interface GuideSectionProps {
  section: IGuideSection;
  index: number;
}

const ASPECTS = [
  { key: "how", icon: LuMousePointerClick, tone: "text-sky-600 dark:text-sky-400" },
  { key: "where", icon: LuMapPin, tone: "text-rose-600 dark:text-rose-400" },
  { key: "why", icon: LuLightbulb, tone: "text-amber-600 dark:text-amber-400" },
] as const;

// One feature: what it is, how, where and why, next to a live demo of it
export const GuideSection: FC<GuideSectionProps> = ({ section, index }) => {
  const { t } = useTranslation();
  const tips = t(`guide.sections.${section.id}.tips`, { returnObjects: true }) as string[];
  const isEven = index % 2 === 0;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
      <Reveal>
        <div className="grid items-start gap-6 rounded-[2rem] border border-white bg-white/60 p-5 backdrop-blur md:p-8 xl:grid-cols-2 xl:gap-10 dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className={cn("flex min-w-0 flex-col gap-5", !isEven && "xl:order-2")}>
            <div className="flex items-center gap-3">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl text-lg", section.tone)}>
                <section.icon aria-hidden />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                {String(index + 1).padStart(2, "0")} · {t(`guide.sections.${section.id}.eyebrow`)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h2
                id={`${section.id}-title`}
                className="text-2xl! md:text-3xl! font-semibold! tracking-tight text-neutral-900 text-balance dark:text-neutral-50"
              >
                {t(`guide.sections.${section.id}.title`)}
              </h2>
              <p className="text-neutral-600 text-pretty dark:text-neutral-400">
                {t(`guide.sections.${section.id}.lead`)}
              </p>
            </div>

            <dl className="flex flex-col gap-3">
              {ASPECTS.map((aspect) => (
                <div key={aspect.key} className="flex gap-3">
                  <dt className={cn("flex w-20 shrink-0 items-center gap-1.5 self-start pt-0.5 text-sm font-semibold", aspect.tone)}>
                    <aspect.icon aria-hidden />
                    {t(`guide.labels.${aspect.key}`)}
                  </dt>
                  <dd className="text-sm text-neutral-700 text-pretty dark:text-neutral-300">
                    {t(`guide.sections.${section.id}.${aspect.key}`)}
                  </dd>
                </div>
              ))}
            </dl>

            {Array.isArray(tips) && tips.length > 0 && (
              <ul className="flex flex-col gap-2 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950/50">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <LuSparkle aria-hidden className="mt-1 shrink-0 text-violet-500" />
                    <span className="text-pretty">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={cn("min-w-0", !isEven && "xl:order-1")}>
            <div className="rounded-3xl bg-neutral-100/80 p-3 md:p-4 dark:bg-neutral-950/40">
              <section.Demo />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
