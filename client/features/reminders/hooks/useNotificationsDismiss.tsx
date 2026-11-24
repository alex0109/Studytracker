"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { dismissAllNotifications, dismissNotification, INotificationFeed, notificationKeys } from "@/entities/notification";

// Removing goes away from the list at once; a failure puts the list back as it was
export const useNotificationsDismiss = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();
  const key = notificationKeys.feed();

  const hide = async (keep: (id: string) => boolean) => {
    await queryClient.cancelQueries({ queryKey: key });
    const before = queryClient.getQueryData<INotificationFeed>(key);
    if (before) {
      const notifications = before.notifications.filter((item) => keep(item.id));
      queryClient.setQueryData<INotificationFeed>(key, {
        ...before,
        notifications,
        unreadCount: notifications.filter((item) => !item.readAt).length,
      });
    }
    return { before };
  };

  const onError = (error: unknown, _: unknown, context?: { before?: INotificationFeed }) => {
    if (context?.before) queryClient.setQueryData(key, context.before);
    logExceptionError(error, { section: "notifications/dismiss", userID: user?.id });
    toast({ title: `❌${t("digest.inbox.deleteError")}`, variant: "error" });
  };
  const onSettled = () => queryClient.invalidateQueries({ queryKey: key });

  const one = useMutation({
    mutationFn: (id: string) => dismissNotification(token, id),
    onMutate: (id) => hide((other) => other !== id),
    onError,
    onSettled,
  });
  const all = useMutation({
    mutationFn: () => dismissAllNotifications(token),
    onMutate: () => hide(() => false),
    onError,
    onSettled,
  });

  return { dismiss: one.mutate, dismissAll: all.mutate, dismissAllIsPending: all.isPending };
};
