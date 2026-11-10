"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowRight, LuCompass } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/config/routes";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { features } from "./data";

export const Features: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="flex w-full max-w-6xl scroll-mt-28 flex-col gap-12 px-4">
      <Reveal>
        <SectionHeading
          eyebrow={t("landing.features.eyebrow")}
          title={t("landing.features.title")}
          text={t("landing.features.text")}
        />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {features.map((feature) => (
          <Reveal key={feature.id} className={cn("min-w-0", feature.span)}>
            <article className="group flex h-full flex-col gap-4 rounded-3xl border border-white bg-white/70 p-5 backdrop-blur transition duration-300 hover:bg-white hover:shadow-xl hover:shadow-neutral-900/5 md:p-6 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-900">
              <header className="flex items-start gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6", feature.tone)}>
                  <feature.icon aria-hidden />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="flex flex-wrap items-center gap-2 text-lg! font-semibold! text-neutral-900 dark:text-neutral-50">
                    {t(`landing.features.items.${feature.id}.title`)}
                    {feature.isNew && (
                      <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {t("landing.features.new")}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-neutral-600 text-pretty dark:text-neutral-400">
                    {t(`landing.features.items.${feature.id}.text`)}
                  </p>
                </div>
              </header>
              <div className={cn(!feature.demoAtTop && "mt-auto")}>
                <feature.Demo />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="flex justify-center">
        <Link
          href={routes.guide}
          className="group inline-flex h-12 items-center gap-2 rounded-2xl border border-white bg-white/80 px-5 font-medium text-neutral-800 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <LuCompass aria-hidden className="text-violet-600 dark:text-violet-400" />
          {t("landing.features.guideLink")}
          <LuArrowRight aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
};
