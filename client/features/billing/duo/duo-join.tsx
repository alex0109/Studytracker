"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { LuLoaderCircle, LuUsers } from "react-icons/lu";
import { Button, toast } from "@/shared/radix-ui";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { useTranslation } from "@/shared/i18n";
import { aiKeys } from "@/entities/ai";
import { limitsKeys } from "@/entities/limits";
import { billingKeys, joinDuo, previewDuoInvite } from "@/entities/billing";

const status = (error: unknown) => (isAxiosError(error) ? error.response?.status : undefined);

// The page an invite link opens: who invites, what joining means, and one button
export const DuoJoin: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useSession();
  const invite = useSearchParams()?.get("token") ?? "";

  const preview = useQuery({
    queryKey: ["billing", "duo-invite", invite],
    queryFn: () => previewDuoInvite(token, invite),
    enabled: !!token && !!invite,
    retry: false,
    staleTime: Infinity,
  });

  const join = useMutation({
    mutationFn: () => joinDuo(token, invite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.duo() });
      queryClient.invalidateQueries({ queryKey: billingKeys.status() });
      queryClient.invalidateQueries({ queryKey: limitsKeys.all });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      toast({ title: t("duo.join.done"), variant: "success" });
      router.push("/limits");
    },
    onError: (error) => {
      if (status(error) === 409) return toast({ title: t("duo.join.conflict"), variant: "error" });
      if (status(error) === 404) return toast({ title: t("duo.join.gone"), variant: "error" });
      logExceptionError(error, { section: "billing/duo-join", userID: user?.id });
      toast({ title: `❌${t("duo.error")}`, variant: "error" });
    },
  });

  const gone = !invite || status(preview.error) === 404 || status(preview.error) === 400;

  return (
    <section className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <span className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-700 dark:bg-violet-950 dark:text-violet-300">
        <LuUsers aria-hidden />
      </span>

      {gone ? (
        <p className="text-neutral-700 dark:text-neutral-200">{t("duo.join.gone")}</p>
      ) : preview.isError ? (
        <p className="text-neutral-700 dark:text-neutral-200">{t("duo.error")}</p>
      ) : !preview.data ? (
        <LuLoaderCircle aria-hidden className="animate-spin text-neutral-400" />
      ) : preview.data.isOwn ? (
        <p className="text-neutral-700 dark:text-neutral-200">{t("duo.join.own")}</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold">
            {preview.data.ownerEmail
              ? t("duo.join.invited", { email: preview.data.ownerEmail })
              : t("duo.join.invitedNoEmail")}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("duo.join.text")}</p>
          <Button size="lg" onClick={() => join.mutate()} disabled={join.isPending} className="self-start">
            {join.isPending && <LuLoaderCircle aria-hidden className="animate-spin" />}
            {t("duo.join.accept")}
          </Button>
        </>
      )}

      {(gone || preview.data?.isOwn) && (
        <Link href="/limits" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          {t("duo.join.toLimits")}
        </Link>
      )}
    </section>
  );
};
