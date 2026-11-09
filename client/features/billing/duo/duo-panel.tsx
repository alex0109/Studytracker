"use client";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCheck, LuCopy, LuLink, LuLoaderCircle, LuLogOut, LuUserMinus } from "react-icons/lu";
import { Button, toast } from "@/shared/radix-ui";
import { ConfirmModal } from "@/shared/ui";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { useTranslation } from "@/shared/i18n";
import { aiKeys } from "@/entities/ai";
import {
  billingKeys,
  cancelDuoInvite,
  createDuoInvite,
  IDuoStatus,
  leaveDuo,
  removeDuoMember,
} from "@/entities/billing";

const formatDate = (value: string, language: string) =>
  new Date(value).toLocaleDateString(language, { day: "numeric", month: "long", year: "numeric" });

// Who shares the Duo. The payer makes a link and sees who joined; the member sees whose Duo it is
export const DuoPanel: FC<{ duo: IDuoStatus }> = ({ duo }) => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();
  const queryClient = useQueryClient();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isOwner = duo.role === "Owner";

  // The member's plan changes with every step here
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: billingKeys.duo() });
    queryClient.invalidateQueries({ queryKey: billingKeys.status() });
    queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
  };

  const fail = (section: string) => (error: Error) => {
    logExceptionError(error, { section, userID: user?.id });
    toast({ title: `❌${t("duo.error")}`, variant: "error" });
  };

  const invite = useMutation({
    mutationFn: () => createDuoInvite(token),
    onSuccess: ({ token: invited }) => {
      setLink(`${window.location.origin}/duo/join?token=${encodeURIComponent(invited)}`);
      setCopied(false);
      queryClient.invalidateQueries({ queryKey: billingKeys.duo() });
    },
    onError: fail("billing/duo-invite"),
  });

  const cancel = useMutation({
    mutationFn: () => cancelDuoInvite(token),
    onSuccess: () => {
      setLink(null);
      queryClient.invalidateQueries({ queryKey: billingKeys.duo() });
    },
    onError: fail("billing/duo-cancel"),
  });

  const part = useMutation({
    mutationFn: () => (isOwner ? removeDuoMember(token) : leaveDuo(token)),
    onSuccess: () => {
      setConfirming(false);
      refresh();
    },
    onError: fail("billing/duo-part"),
  });

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Without clipboard access the field stays selectable by hand
      setCopied(false);
    }
  };

  const confirm = (
    <ConfirmModal
      open={confirming}
      onClose={() => !part.isPending && setConfirming(false)}
      onConfirm={() => part.mutate()}
      pending={part.isPending}
      icon={isOwner ? <LuUserMinus /> : <LuLogOut />}
      title={t(isOwner ? "duo.removeConfirm" : "duo.leaveConfirm")}
      description={isOwner ? t("duo.removeText", { email: duo.memberEmail ?? "" }) : t("duo.leaveText")}
      confirmText={t(isOwner ? "duo.remove" : "duo.leave")}
    />
  );

  if (!isOwner) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-neutral-700 dark:text-neutral-200">
          {t(duo.active ? "duo.memberOf" : "duo.memberLapsed", { email: duo.ownerEmail ?? "—" })}
        </p>
        <Button variant="outline" onClick={() => setConfirming(true)} className="self-start">
          <LuLogOut aria-hidden /> {t("duo.leave")}
        </Button>
        {confirm}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {!duo.active && <p className="text-sm text-amber-700 dark:text-amber-400">{t("duo.lapsed")}</p>}

      {duo.memberEmail ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{duo.memberEmail}</span>
            {duo.joinedAt && (
              <span className="text-xs text-neutral-500">{t("duo.joined", { date: formatDate(duo.joinedAt, i18n.language) })}</span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
            <LuUserMinus aria-hidden /> {t("duo.remove")}
          </Button>
        </div>
      ) : (
        duo.canInvite && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("duo.inviteText")}</p>
            {link && (
              <div className="flex gap-2">
                <input
                  readOnly
                  value={link}
                  aria-label={t("duo.linkLabel")}
                  onFocus={(event) => event.currentTarget.select()}
                  className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
                <Button variant="outline" onClick={copy}>
                  {copied ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />}
                  {t(copied ? "duo.copied" : "duo.copy")}
                </Button>
              </div>
            )}
            {duo.inviteExpiresAt && (
              <p className="text-xs text-neutral-500">{t("duo.linkUntil", { date: formatDate(duo.inviteExpiresAt, i18n.language) })}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => invite.mutate()} disabled={invite.isPending}>
                {invite.isPending ? <LuLoaderCircle aria-hidden className="animate-spin" /> : <LuLink aria-hidden />}
                {t(link || duo.inviteExpiresAt ? "duo.newLink" : "duo.makeLink")}
              </Button>
              {duo.inviteExpiresAt && (
                <Button variant="ghost" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
                  {t("duo.cancelLink")}
                </Button>
              )}
            </div>
          </div>
        )
      )}

      {confirm}
    </div>
  );
};
