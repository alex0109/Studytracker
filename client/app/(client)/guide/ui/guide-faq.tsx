"use client";

import { FC } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { LuPlus } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { Reveal } from "../../(home)/ui/Reveal";
import { SectionHeading } from "../../(home)/ui/SectionHeading";

const QUESTIONS = ["free", "private", "quota", "export", "languages"] as const;

export const GuideFaq: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="faq" aria-labelledby="faq-title" className="flex scroll-mt-28 flex-col gap-8">
      <Reveal>
        <SectionHeading
          eyebrow={t("guide.faq.eyebrow")}
          title={<span id="faq-title">{t("guide.faq.title")}</span>}
          align="left"
        />
      </Reveal>
      <Reveal>
        <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
          {QUESTIONS.map((key) => (
            <Accordion.Item
              key={key}
              value={key}
              className="overflow-hidden rounded-2xl border border-white bg-white/70 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60">
                  {t(`guide.faq.items.${key}.q`)}
                  <LuPlus aria-hidden className="shrink-0 text-neutral-400 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-neutral-600 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down dark:text-neutral-400">
                <p className="px-5 pb-4 text-pretty">{t(`guide.faq.items.${key}.a`)}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Reveal>
    </section>
  );
};
