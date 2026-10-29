"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { glossary } from "./data";

export const Glossary: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex w-full max-w-6xl flex-col gap-12 px-4">
      <Reveal>
        <SectionHeading
          eyebrow={t("landing.glossary.eyebrow")}
          title={t("landing.glossary.title")}
          text={t("landing.glossary.text")}
        />
      </Reveal>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {glossary.map((item) => (
          <Reveal key={item.key}>
            <div className="group flex h-full gap-4 rounded-2xl border border-white bg-white/70 p-5 backdrop-blur transition duration-300 hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-900">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform duration-300 group-hover:-rotate-6 dark:bg-neutral-100 dark:text-neutral-900">
                <item.icon />
              </span>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {t(`landing.glossary.items.${item.key}.name`)}
                </dt>
                <dd className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t(`landing.glossary.items.${item.key}.text`)}
                </dd>
              </div>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
};
