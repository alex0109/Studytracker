"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import {
  cancelLibraryRequest,
  createLibraryRequest,
  ILibraryRequestCreate,
  LibraryRequestTypeEnum,
  libraryKeys,
} from "@/entities/library";
import { getLibraryRequestError } from "../lib/request-error";
import { profileKeys } from "@/entities/profile";

const SENT_KEYS = {
  [LibraryRequestTypeEnum.Publish]: "library.toasts.sentPublish",
  [LibraryRequestTypeEnum.Update]: "library.toasts.sentUpdate",
  [LibraryRequestTypeEnum.Remove]: "library.toasts.sentRemove",
} as const;

export const useLibraryRequestCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: ILibraryRequestCreate) => createLibraryRequest(token, body),
    onSuccess: (request) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.requests() });
      if (request.libraryItemId) {
        queryClient.invalidateQueries({ queryKey: libraryKeys.detail(request.libraryItemId) });
      }
      // The first nickname is saved to the profile by the server
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      toast({ title: `📬${t(SENT_KEYS[request.type])}`, variant: "success" });
    },
    onError: (error) => {
      const message = getLibraryRequestError(error, t);
      if (!message) {
        logExceptionError(error, { section: "library/requests (create)", userID: user?.id });
      }

      toast({ title: `⚠️${message ?? t("library.errors.generic")}`, variant: "error" });
    },
  });

  return {
    createLibraryRequest: mutation.mutateAsync,
    createLibraryRequestIsPending: mutation.isPending,
  };
};

export const useLibraryRequestCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (requestId: string) => cancelLibraryRequest(token, requestId),
    onSuccess: () => {
      // Pending markers on library materials go away too
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      toast({ title: `✅${t("library.toasts.cancelled")}`, variant: "success" });
    },
    onError: (error) => {
      logExceptionError(error, { section: "library/requests (cancel)", userID: user?.id });
      toast({ title: `❌${t("library.errors.generic")}`, variant: "error" });
    },
  });

  return {
    cancelLibraryRequest: mutation.mutate,
    cancelLibraryRequestIsPending: mutation.isPending,
  };
};
