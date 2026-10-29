"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import {
  markAllNotificationsRead,
  markNotificationRead,
  notificationKeys,
} from "@/entities/notification";

export const useNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const onError = (error: unknown) =>
    logExceptionError(error, { section: "notifications/read", userID: user?.id });
  const onSettled = () => queryClient.invalidateQueries({ queryKey: notificationKeys.feed() });

  const one = useMutation({
    mutationFn: (id: string) => markNotificationRead(token, id),
    onError,
    onSettled,
  });
  const all = useMutation({
    mutationFn: () => markAllNotificationsRead(token),
    onError,
    onSettled,
  });

  return {
    markRead: one.mutate,
    markAllRead: all.mutate,
    markAllReadIsPending: all.isPending,
  };
};
