"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { exportAccount } from "@/entities/account";

// The token goes in a header, so a plain link can't download it: the blob is saved through an object URL
const save = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `studytracker-export-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const useAccountExport = () => {
  const { t } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: () => exportAccount(token),
    onSuccess: (blob) => {
      save(blob);
      toast({ title: `✅${t("account.export.done")}`, variant: "success" });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast({ title: t("account.export.tooOften"), variant: "error" });
        return;
      }
      logExceptionError(error, { section: "account/export", userID: user?.id });
      toast({ title: `❌${t("account.export.error")}`, variant: "error" });
    },
  });

  return { exportAccount: mutation.mutate, exportAccountIsPending: mutation.isPending };
};
