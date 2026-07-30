"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { tagKeys } from "../lib/tag-query-keys";
import { getAllTags } from "../api";
import { ITagResponse } from "../model";

export const useTagsAll = () => {
  const { token, user } = useSession();

  const tags = useQuery<ITagResponse[]>({
    queryKey: tagKeys.all,
    queryFn: () => getAllTags(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (tags.error) {
      logExceptionError(tags.error, {
        section: "tags",
        userID: user?.id,
      });
    }
  }, [tags.error]);

  return {
    tagsData: tags.data,
    tagsIsPending: tags.isPending,
    tagsError: tags.error,
  };
};
