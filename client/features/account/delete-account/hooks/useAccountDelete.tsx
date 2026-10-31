"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { deleteAccount, isReauthRequired } from "@/entities/account";
import { signOut } from "@/entities/auth";

export const DELETED_PARAM = "accountDeleted";

export const useAccountDelete = (onReauthRequired: () => void) => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (confirmEmail: string) =>
      deleteAccount(token, { confirmEmail, language: i18n.language }),
    // The session goes too, the home page then says the account is gone. Not returned: the
    // redirect ends the action with a navigation, which the mutation would take for a failure
    onSuccess: () => {
      void signOut(`/?${DELETED_PARAM}=1`);
    },
    onError: (error) => {
      if (isReauthRequired(error)) {
        onReauthRequired();
        return;
      }
      logExceptionError(error, { section: "account/delete", userID: user?.id });
      toast({ title: `❌${t("account.delete.error")}`, variant: "error" });
    },
  });

  return { deleteAccount: mutation.mutate, deleteAccountIsPending: mutation.isPending || mutation.isSuccess };
};
