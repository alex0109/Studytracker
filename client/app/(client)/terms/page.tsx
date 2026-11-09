import type { Metadata } from "next";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBan,
  LuCreditCard,
  LuFolderHeart,
  LuHandCoins,
  LuLayers,
  LuMessageCircle,
  LuPencilLine,
  LuRefreshCw,
  LuScale,
  LuShieldCheck,
  LuSparkles,
  LuSprout,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";
import { getServerT } from "@/shared/i18n/server";
import { cn } from "@/shared/lib/cn";
import { fetchBillingPlans } from "@/entities/billing/api/server";
import { formatPrice } from "@/entities/billing/lib";
import type { IBillingPlans, IBillingPrice } from "@/entities/billing/model";

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerT();

  return {
    title: `Studytracker | ${t("terms.title")}`,
    description: t("terms.intro"),
    alternates: { canonical: "/terms" },
  };
};

const SUMMARY = [
  { key: "free", icon: LuSprout, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { key: "cancel", icon: LuRefreshCw, tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { key: "content", icon: LuFolderHeart, tone: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { key: "payment", icon: LuShieldCheck, tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
] as const;

const SECTIONS = [
  { key: "service", icon: LuUserRound },
  { key: "plans", icon: LuLayers },
  { key: "payment", icon: LuCreditCard },
  { key: "cancel", icon: LuRefreshCw },
  { key: "refunds", icon: LuHandCoins },
  { key: "duo", icon: LuUsers },
  { key: "content", icon: LuFolderHeart },
  { key: "ai", icon: LuSparkles },
  { key: "rules", icon: LuBan },
  { key: "changes", icon: LuPencilLine },
  { key: "law", icon: LuScale },
  { key: "contact", icon: LuMessageCircle },
] as const satisfies readonly { key: string; icon: IconType }[];

// Kroner first, then dollars and euros: the currencies the prices are set in
const CURRENCY_ORDER = ["nok", "usd", "eur"];

const priceText = (price: IBillingPrice | undefined, language: string) => {
  if (!price) return "—";

  const amounts = price.amounts ?? { [price.currency]: price.amount };
  return Object.entries(amounts)
    .sort(([a], [b]) => (CURRENCY_ORDER.indexOf(a) + 1 || 99) - (CURRENCY_ORDER.indexOf(b) + 1 || 99))
    .map(([currency, amount]) => formatPrice(amount, currency, language))
    .join(" · ");
};

const linkClass =
  "inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400";

type TableLabels = Record<"plan" | "monthly" | "yearly" | "free" | "note" | "soon", string>;

const PlansTable = ({ plans, language, labels }: { plans: IBillingPlans | null; language: string; labels: TableLabels }) => {
  const priced = plans?.plans.filter((plan) => plan.tier !== "Free" && plan.prices.length > 0) ?? [];
  if (priced.length === 0) return <p className="text-sm text-neutral-500">{labels.soon}</p>;

  const rows = [
    { tier: "Free", monthly: labels.free, yearly: labels.free },
    ...priced.map((plan) => ({
      tier: plan.tier,
      monthly: priceText(plan.prices.find((x) => x.interval === "Month"), language),
      yearly: priceText(plan.prices.find((x) => x.interval === "Year"), language),
    })),
  ];

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-400">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">{labels.plan}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{labels.monthly}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{labels.yearly}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {rows.map((row) => (
              <tr key={row.tier}>
                <th scope="row" className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-50">
                  <span className="inline-flex items-center gap-2">
                    {row.tier === "Duo" && <LuUsers aria-hidden className="text-violet-600 dark:text-violet-400" />}
                    {row.tier === "Plus" && <LuSparkles aria-hidden className="text-emerald-600 dark:text-emerald-400" />}
                    {row.tier === "Free" && <LuSprout aria-hidden className="text-neutral-400" />}
                    {row.tier}
                  </span>
                </th>
                <td className="px-4 py-3 tabular-nums text-neutral-700 dark:text-neutral-300">{row.monthly}</td>
                <td className="px-4 py-3 tabular-nums text-neutral-700 dark:text-neutral-300">{row.yearly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-neutral-500">
        <LuBadgeCheck aria-hidden className="mt-0.5 shrink-0" /> {labels.note}
      </p>
    </div>
  );
};

// What using the site and paying for it means, in plain words. Stripe's review and its customer
// portal link here. Server-rendered with no scripts, like the privacy page: anchors for contents
const Terms = async () => {
  const { t, language } = await getServerT();
  const plans = await fetchBillingPlans();

  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-20">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <LuScale aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("terms.title")}</h1>
        <p className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          {t("terms.updated")}
        </p>
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300">
          {t("terms.intro")}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY.map(({ key, icon: Icon, tone }) => (
          <li
            key={key}
            className="flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span aria-hidden className={cn("flex size-10 items-center justify-center rounded-xl text-lg", tone)}>
              <Icon />
            </span>
            <p className="font-semibold text-neutral-900 dark:text-neutral-50">{t(`terms.summary.${key}.title`)}</p>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t(`terms.summary.${key}.text`)}</p>
          </li>
        ))}
      </ul>

      {/* grid-cols-1 is minmax(0, 1fr): the price table scrolls inside its card instead of widening the page */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        {/* Under the fixed menu bar while scrolling */}
        <nav aria-label={t("terms.contents")} className="hidden lg:block">
          <ol className="sticky top-32 flex flex-col gap-0.5 border-l border-neutral-200 text-sm dark:border-neutral-800">
            {SECTIONS.map(({ key }) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
                >
                  {t(`terms.${key}.title`)}
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
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <h2 id={`${key}-title`} className="flex items-baseline gap-2 text-lg font-semibold">
                  <span aria-hidden className="text-sm font-medium text-neutral-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {t(`terms.${key}.title`)}
                </h2>
                {(t(`terms.${key}.items`, { returnObjects: true }) as string[]).map((item) => (
                  <p key={item} className="leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300">
                    {item}
                  </p>
                ))}

                {key === "plans" && (
                  <PlansTable
                    plans={plans}
                    language={language}
                    labels={{
                      plan: t("terms.table.plan"),
                      monthly: t("terms.table.monthly"),
                      yearly: t("terms.table.yearly"),
                      free: t("terms.table.free"),
                      note: t("terms.table.note"),
                      soon: t("terms.table.soon"),
                    }}
                  />
                )}
                {key === "cancel" && (
                  <Link href="/limits" className={linkClass}>
                    {t("terms.toPlan")} <LuArrowRight aria-hidden />
                  </Link>
                )}
                {key === "contact" && (
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <Link href="/home#feedback" className={linkClass}>
                      {t("terms.toFeedback")} <LuArrowRight aria-hidden />
                    </Link>
                    <Link href="/privacy" className={linkClass}>
                      {t("terms.toPrivacy")} <LuArrowRight aria-hidden />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
};

export default Terms;
