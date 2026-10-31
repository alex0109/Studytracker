"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getProfile } from "../api";
import { profileKeys } from "../lib";
import { IProfile } from "../model";

export const useProfile = () => {
  const { token, user } = useSession();

  const profile = useQuery<IProfile, Error>({
    queryKey: profileKeys.all,
    queryFn: () => getProfile(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (profile.error) {
      logExceptionError(profile.error, { section: "profile", userID: user?.id });
    }
  }, [profile.error, user?.id]);

  return {
    profileData: profile.data,
    profileIsPending: profile.isPending,
    profileError: profile.error,
  };
};
