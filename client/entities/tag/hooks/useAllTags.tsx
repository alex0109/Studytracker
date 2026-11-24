"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { logExceptionError } from "@/shared/lib";
import { tagKeys } from "../lib/tag-query-keys";
import { getAllTags } from "../api";
import { ITagResponse } from "../model";

export const useTagsAll = () => {
  const { token, user } = useSession();

  const tags = useQuery<ITagResponse[]>({
    queryKey: tagKeys.all,
    queryFn: () => getAllTags(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (tags.error) {
      logExceptionError(tags.error, {
        section: "tags",
        userID: user?.id,
      });
    }
  }, [tags.error, user?.id]);

  return {
    tagsData: tags.data,
    tagsIsPending: tags.isPending,
    tagsError: tags.error,
  };
};
