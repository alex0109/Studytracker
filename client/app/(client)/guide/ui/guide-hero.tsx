"use client";

import { FC } from "react";
import Link from "next/link";
import { LuArrowRight, LuFilePlus, LuShieldCheck, LuSparkles } from "react-icons/lu";
import { useSession } from "@/shared/context/session.provider";
import { routes } from "@/shared/config/routes";
import { useTranslation } from "@/shared/i18n";
import { BrandEmblem } from "../../(home)/ui/BrandEmblem";
import { guideSections } from "./data";

const QUICK_STEPS = [
  { key: "add", icon: LuFilePlus },
  { key: "ask", icon: LuSparkles },
  { key: "defend", icon: LuShieldCheck },
] as const;

export const GuideHero: FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();

  return (
    <header className="flex w-full max-w-6xl flex-col items-center gap-10 px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <BrandEmblem className="size-24 md:size-28" />
        <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
          {t("guide.hero.eyebrow")}
        </span>
        <h1 className="max-w-3xl text-4xl! md:text-6xl! font-semibold! leading-[1.05] tracking-tight text-neutral-900 text-balance dark:text-neutral-50">
          {t("guide.hero.title")}{" "}
          <span className="bg-linear-to-r from-emerald-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
            {t("guide.hero.accent")}
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-neutral-600 text-pretty dark:text-neutral-400">{t("guide.hero.text")}</p>
      </div>

      {/* The shortest path, for those who only want to start */}
      <ol className="grid w-full gap-3 text-left sm:grid-cols-3">
        {QUICK_STEPS.map((step, index) => (
          <li
            key={step.key}
            className="flex gap-3 rounded-2xl border border-white bg-white/70 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <step.icon aria-hidden />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-mono text-neutral-400">
                {t("guide.quick.step", { step: index + 1 })}
              </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t(`guide.quick.${step.key}.title`)}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{t(`guide.quick.${step.key}.text`)}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={user ? routes.materials : routes.auth}
          className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-neutral-900 px-6 font-medium text-white shadow-lg shadow-neutral-900/20 transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          {user ? t("landing.hero.openMaterials") : t("landing.hero.start")}
          <LuArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Contents for narrow screens; wide ones have it on the side */}
      <nav aria-label={t("guide.hero.toc")} className="w-full lg:hidden">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {guideSections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white bg-white/80 px-3 text-sm font-medium text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200"
              >
                <section.icon aria-hidden className="text-neutral-400" />
                {t(`guide.sections.${section.id}.short`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
