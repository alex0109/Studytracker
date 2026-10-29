"use client";

import { FC } from "react";
import { LuMessageCircleHeart } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { FeedbackForm } from "@/features/feedback/send-feedback";
import { Reveal } from "../Reveal";

// Last block of the landing page: a direct line to the author
export const FeedbackSection: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="feedback" className="w-full max-w-6xl scroll-mt-28 px-4">
      <Reveal>
        <div className="grid gap-8 rounded-[2rem] border border-white bg-white/80 p-6 shadow-sm backdrop-blur md:grid-cols-[1fr_1.4fr] md:p-10 dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="flex flex-col gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-neutral-900 text-xl text-white dark:bg-neutral-100 dark:text-neutral-900">
              <LuMessageCircleHeart aria-hidden />
            </span>
            <h2 className="text-3xl! font-semibold! tracking-tight text-neutral-900 text-balance dark:text-neutral-50">
              {t("feedback.title")}
            </h2>
            <p className="text-neutral-600 text-pretty dark:text-neutral-400">{t("feedback.text")}</p>
          </div>
          <FeedbackForm />
        </div>
      </Reveal>
    </section>
  );
};
