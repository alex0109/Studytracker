"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getNotificationFeed, getNotificationSettings } from "../api";
import { notificationKeys } from "../lib";
import { INotificationFeed, INotificationSettings } from "../model";

export const useNotificationFeed = () => {
  const { token, user } = useSession();

  const feed = useQuery<INotificationFeed, Error>({
    queryKey: notificationKeys.feed(),
    queryFn: () => getNotificationFeed(token),
    enabled: !!token,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (feed.error) {
      logExceptionError(feed.error, { section: "notifications/feed", userID: user?.id });
    }
  }, [feed.error, user?.id]);

  return {
    feedData: feed.data,
    feedIsPending: feed.isPending,
    feedError: feed.error,
  };
};

export const useNotificationSettings = () => {
  const { token, user } = useSession();

  const settings = useQuery<INotificationSettings, Error>({
    queryKey: notificationKeys.settings(),
    queryFn: () => getNotificationSettings(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (settings.error) {
      logExceptionError(settings.error, { section: "notifications/settings", userID: user?.id });
    }
  }, [settings.error, user?.id]);

  return {
    settingsData: settings.data,
    settingsIsPending: settings.isPending,
  };
};
