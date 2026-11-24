"use client";

import { FC, ReactNode, useState } from "react";
import { LuChevronDown, LuCoins, LuLoaderCircle } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { aiKeys } from "@/entities/ai";
import { billingKeys, formatPrice, setCreditAutoUse, useCreditPricing, useCreditWallet } from "@/entities/billing";
import { useCreditCheckout } from "./use-credit-checkout";
import { CreditHistory } from "./credit-history";

// A heading that opens what is under it; children may be a function, to render only when open
const Disclosure: FC<{ title: string; children: ReactNode | ((open: boolean) => ReactNode) }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 text-sm font-semibold"
      >
        {title}
        <LuChevronDown aria-hidden className={cn("shrink-0 text-neutral-400 transition", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3">{typeof children === "function" ? children(open) : children}</div>}
    </div>
  );
};

// The credit wallet: balance, packs to buy, auto-use for study AI; what things cost and the history on demand
export const CreditsPanel: FC = () => {
  const { t, i18n } = useTranslation();
  const { token } = useSession();
  const queryClient = useQueryClient();
  const { creditPricing } = useCreditPricing();
  const { creditWallet } = useCreditWallet();
  const { buyPack, buyingPack } = useCreditCheckout();

  const autoUse = useMutation({
    mutationFn: (enabled: boolean) => setCreditAutoUse(token, enabled),
    onSuccess: (wallet) => {
      queryClient.setQueryData(billingKeys.creditWallet(), wallet);
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
    },
    onError: () => toast({ title: `❌${t("credits.checkoutError")}`, variant: "error" }),
  });

  const packs = creditPricing?.packs ?? [];
  // The most credits per unit of money
  const ratio = (pack: { credits: number; price: number }) => pack.credits / pack.price;
  const best = packs.length > 1 ? packs.reduce((a, b) => (ratio(b) > ratio(a) ? b : a)).id : null;
  const money = (price: number, currency: string) => formatPrice(Math.round(price * 100), currency.toLowerCase(), i18n.language);
  const unit = (feature: string) => {
    const name = t(`ai.units.${feature}` as "ai.units.VideoTranscript");
    return name ? ` ${name}` : "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-neutral-500">{t("credits.balance")}</span>
          <span className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums">{(creditWallet?.balance ?? 0).toLocaleString(i18n.language)}</span>
            <span className="text-neutral-500">{t("credits.unit")}</span>
          </span>
        </div>
        <label className="flex max-w-sm items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={creditWallet?.autoUseForStudy ?? false}
            disabled={!creditWallet || autoUse.isPending}
            onChange={(event) => autoUse.mutate(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-violet-600"
          />
          <span className="flex flex-col">
            {t("credits.auto")}
            <span className="text-xs text-neutral-500">{t("credits.autoHint")}</span>
          </span>
        </label>
      </div>

      {creditPricing?.checkoutAvailable === false ? (
        <p className="text-sm text-neutral-500">{t("credits.unavailable")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={cn(
                "relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center",
                pack.id === best
                  ? "border-violet-300 bg-violet-50/60 dark:border-violet-800 dark:bg-violet-950/30"
                  : "border-neutral-200 dark:border-neutral-800",
              )}
            >
              {pack.id === best && (
                <span className="absolute -top-2.5 rounded-full bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {t("credits.bestValue")}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-2xl font-bold tabular-nums">
                <LuCoins aria-hidden className="text-violet-500" />
                {pack.credits.toLocaleString(i18n.language)}
              </span>
              <span className="text-sm text-neutral-500">{money(pack.price, pack.currency)}</span>
              <Button
                size="lg"
                className="w-full"
                disabled={!!buyingPack}
                onClick={() => buyPack(pack.id)}
              >
                {buyingPack === pack.id && <LuLoaderCircle aria-hidden className="animate-spin" />}
                {t("credits.buyPack")}
              </Button>
            </div>
          ))}
        </div>
      )}
      <p className="-mt-3 text-xs text-neutral-500">{t("credits.packNote")}</p>

      {creditPricing && creditPricing.prices.length > 0 && (
        <Disclosure title={t("credits.prices")}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {creditPricing.prices.map((price) => (
              <div key={price.feature} className="flex items-baseline justify-between gap-3">
                <dt className="text-neutral-600 dark:text-neutral-400">{t(`ai.features.${price.feature}` as "ai.features.QuestionGeneration")}</dt>
                <dd className="font-medium tabular-nums">
                  {price.block > 1
                    ? t("credits.perBlock", { credits: price.credits, block: price.block, unit: unit(price.feature) })
                    : t("credits.perRequest", { credits: price.credits })}
                </dd>
              </div>
            ))}
          </dl>
        </Disclosure>
      )}

      {/* Loaded only when opened */}
      <Disclosure title={t("credits.history")}>{(open) => open && <CreditHistory />}</Disclosure>
    </div>
  );
};
