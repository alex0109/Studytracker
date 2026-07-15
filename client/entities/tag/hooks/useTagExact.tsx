"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { ITagResponse } from "../model";
import { tagKeys } from "../lib/tag-query-keys";
import { getTag } from "../api";

export const useTagExact = (id: string) => {
  const { token, user } = useSession();

  const exactTag = useQuery<ITagResponse, Error>({
    queryKey: tagKeys.detail(id),
    queryFn: () => getTag(token, id),
    enabled: !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactTag.error) {
      logExceptionError(exactTag.error, {
        section: `tags/${id}`,
        userID: user?.id,
      });
    }
  }, [exactTag.error]);

  return {
    exactTagData: exactTag.data,
    exactTagLoading: exactTag.isLoading,
    exactTagError: exactTag.error,
  };
};
