"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";

const QUESTIONS = ["cancel", "duo", "change", "currency", "refund"] as const;

// The questions people ask before paying, answered where they decide; the terms say the rest
export const BillingFaq: FC = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="billing-faq-title" className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="billing-faq-title" className="text-2xl! font-semibold! tracking-tight">
          {t("billing.page.faqTitle")}
        </h2>
        <Link
          href="/terms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          {t("billing.page.allTerms")} <LuArrowRight aria-hidden />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {QUESTIONS.map((key) => (
          <details
            key={key}
            className="group rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 font-medium transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:hover:bg-neutral-800/60 [&::-webkit-details-marker]:hidden">
              {t(`billing.page.faq.${key}.q`)}
              <LuChevronDown
                aria-hidden
                className="shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="px-5 pb-4 leading-relaxed text-pretty text-neutral-600 dark:text-neutral-400">
              {t(`billing.page.faq.${key}.a`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
