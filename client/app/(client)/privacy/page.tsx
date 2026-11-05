import type { Metadata } from "next";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBug,
  LuChartColumn,
  LuDatabase,
  LuMessageCircle,
  LuServer,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import { getServerT } from "@/shared/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("privacy.title")}`,
    description: t("privacy.intro"),
    alternates: { canonical: "/privacy" },
  };
};

const SECTIONS = [
  { key: "data", icon: LuDatabase },
  { key: "analytics", icon: LuChartColumn },
  { key: "errors", icon: LuBug },
  { key: "ai", icon: LuSparkles },
  { key: "services", icon: LuServer },
  { key: "rights", icon: LuShieldCheck },
  { key: "contact", icon: LuMessageCircle },
] as const satisfies readonly { key: string; icon: IconType }[];

// Plain words about what the site keeps and who helps run it; analytics need it shown before consent.
// Server-rendered with no scripts: the contents are anchors, the page reads without JavaScript
const Privacy = async () => {
  const { t } = await getServerT();

  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-20">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <LuShieldCheck aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("privacy.title")}</h1>
        <p className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          {t("privacy.updated")}
        </p>
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300">
          {t("privacy.intro")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        {/* Under the fixed menu bar while scrolling */}
        <nav aria-label={t("privacy.contents")} className="hidden lg:block">
          <ol className="sticky top-32 flex flex-col gap-0.5 border-l border-neutral-200 text-sm dark:border-neutral-800">
            {SECTIONS.map(({ key }) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
                >
                  {t(`privacy.${key}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-4">
          {SECTIONS.map(({ key, icon: Icon }, index) => (
            <section
              key={key}
              id={key}
              aria-labelledby={`${key}-title`}
              className="flex scroll-mt-32 gap-4 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                <Icon aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <h2 id={`${key}-title`} className="flex items-baseline gap-2 text-lg font-semibold">
                  <span aria-hidden className="text-sm font-medium text-neutral-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {t(`privacy.${key}.title`)}
                </h2>
                <p className="leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300">
                  {t(`privacy.${key}.text`)}
                </p>
                {key === "rights" && (
                  <Link
                    href="/account"
                    className="mt-1 inline-flex items-center gap-1.5 self-start text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                  >
                    {t("privacy.toAccount")}
                    <LuArrowRight aria-hidden />
                  </Link>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
};

export default Privacy;
