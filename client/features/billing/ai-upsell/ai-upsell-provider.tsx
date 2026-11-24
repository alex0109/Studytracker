"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { LuCoins, LuSparkles, LuTextCursorInput } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { Modal } from "@/shared/ui";
import { useSession } from "@/shared/context";
import { useTranslation } from "@/shared/i18n";
import { aiDenialOf, aiKeys, IAiDenial, markAiDenialHandled } from "@/entities/ai";
import { billingKeys, setCreditAutoUse } from "@/entities/billing";

// Sent again with this header once the user agreed to pay with credits
const USE_CREDITS = "X-Use-Credits";

type Decision = "credits" | "close";

interface Pending {
  denial: IAiDenial;
  resolve: (decision: Decision) => void;
}

// Every AI request the server refuses with 402 lands here: the window says why and offers what would
// let it run — paying with credits (then the same request goes again), buying credits or another plan.
// One place for all features, so none of them handles quotas on its own
export const AiUpsellProvider: FC = () => {
  const { t } = useTranslation();
  const { token } = useSession();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<Pending | null>(null);
  const [autoUse, setAutoUse] = useState(false);
  useEffect(() => {
    // Opens the window and waits for the user's choice; state setters are stable
    const ask = (denial: IAiDenial) =>
      new Promise<Decision>((resolve) => {
        setAutoUse(false);
        setPending({ denial, resolve });
      });

    const id = axios.interceptors.response.use(undefined, async (error: AxiosError) => {
      const denial = aiDenialOf(error);
      const config = error.config as InternalAxiosRequestConfig | undefined;
      if (!denial || !config) throw error;

      const decision = await ask(denial);
      if (decision !== "credits") {
        markAiDenialHandled(error);
        throw error;
      }

      config.headers.set(USE_CREDITS, "true");
      return axios.request(config);
    });

    return () => axios.interceptors.response.eject(id);
  }, []);

  const finish = useCallback(
    async (decision: Decision) => {
      if (!pending) return;
      if (decision === "credits" && autoUse) {
        // The choice is saved; the request goes on either way
        await setCreditAutoUse(token, true).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: billingKeys.creditWallet() });
      }
      if (decision === "credits") queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      pending.resolve(decision);
      setPending(null);
    },
    [pending, autoUse, token, queryClient],
  );

  if (!pending) return null;

  const { denial } = pending;
  const required = denial.creditsRequired;
  const canPay = required !== null && denial.code !== "insufficient_credits" && denial.creditBalance >= required;
  const canBuy = required !== null && !canPay;
  const tooLarge = denial.code === "input_too_large";
  const max = denial.maxInputChars?.toLocaleString();

  const title = tooLarge
    ? t("credits.upsell.titleTooLarge")
    : denial.code === "insufficient_credits" || canBuy
      ? t("credits.upsell.titleCredits")
      : denial.code === "trial_used"
        ? t("credits.upsell.titleTrial")
        : t("credits.upsell.titleQuota");

  const text = tooLarge
    ? t("credits.upsell.tooLargeText", { max })
    : canPay
      ? t("credits.upsell.useText", { credits: required, balance: denial.creditBalance })
      : canBuy
        ? t("credits.upsell.buyText", { credits: required, balance: denial.creditBalance })
        : t("credits.upsell.upgradeText");

  const goTo = (hash: string) => (
    <Button asChild variant="outline" size="lg" onClick={() => finish("close")}>
      <Link href={`/limits${hash}`}>{t(hash === "#credits" ? "credits.upsell.buy" : "credits.upsell.upgrade")}</Link>
    </Button>
  );

  return (
    <Modal
      open
      onClose={() => finish("close")}
      title={title}
      description={text}
      icon={tooLarge ? <LuTextCursorInput /> : canPay ? <LuCoins /> : <LuSparkles />}
      tone={tooLarge ? "warning" : "ai"}
      footer={
        tooLarge ? (
          <Button size="lg" onClick={() => finish("close")}>
            {t("credits.upsell.ok")}
          </Button>
        ) : canPay ? (
          <>
            {goTo("#plans")}
            <Button size="lg" onClick={() => finish("credits")} className="bg-violet-600 text-white hover:bg-violet-700">
              {t("credits.upsell.use", { credits: required })}
            </Button>
          </>
        ) : (
          <>
            {goTo("#plans")}
            {canBuy && goTo("#credits")}
          </>
        )
      }
    >
      {canPay && denial.bucket === "Study" && (
        <label className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <input type="checkbox" checked={autoUse} onChange={(event) => setAutoUse(event.target.checked)} className="size-4 accent-violet-600" />
          {t("credits.upsell.auto")}
        </label>
      )}
    </Modal>
  );
};
