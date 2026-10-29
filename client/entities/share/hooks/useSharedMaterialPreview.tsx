"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { ISharedMaterialPreview } from "../model";
import { shareKeys } from "../lib";
import { getSharedMaterialPreview } from "../api";

export const useSharedMaterialPreview = (shareToken: string) => {
  const { token, user } = useSession();

  const preview = useQuery<ISharedMaterialPreview | null, Error>({
    queryKey: shareKeys.preview(shareToken, user?.id),
    queryFn: () => getSharedMaterialPreview(token, shareToken),
    enabled: !!shareToken,
  });

  useEffect(() => {
    if (preview.error) {
      logExceptionError(preview.error, {
        section: `shares/${shareToken}`,
        userID: user?.id,
      });
    }
  }, [preview.error]);

  return {
    previewData: preview.data,
    previewIsPending: preview.isPending,
    previewError: preview.error,
  };
};
