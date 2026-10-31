"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLimitErrorMessage } from "@/shared/lib/limits";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { ArticleImportErrorCode, importMaterial, materialKeys } from "@/entities/material";
import { aiKeys } from "@/entities/ai";
import { trackEvent } from "@/shared/lib/analytics";

const CODES: ArticleImportErrorCode[] = [
  "InvalidUrl",
  "BlockedAddress",
  "Unreachable",
  "Timeout",
  "TooLarge",
  "NotHtml",
  "NotAnArticle",
  "VideoNotSupported",
];

export const useMaterialImport = (onImported: (materialId: string) => void) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const mutation = useMutation({
    mutationFn: (body: { url: string; generateQuestions: boolean }) => importMaterial(token, body),
    onSuccess: (result, body) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.list() });
      if (body.generateQuestions) queryClient.invalidateQueries({ queryKey: aiKeys.usage() });

      toast({
        title: `🎉${t("materials.import.done")}`,
        description: body.generateQuestions
          ? result.questionsCreated > 0
            ? t("materials.import.questions", { count: result.questionsCreated })
            : t(`materials.import.questionsSkipped.${result.questionsSkipped ?? "failed"}`)
          : undefined,
        variant: "success",
        durationMs: 6000,
      });
      trackEvent("import_article", { with_questions: body.generateQuestions });
      onImported(result.material.id);
    },
    onError: (error) => {
      const limit = getLimitErrorMessage(error, t);
      if (limit) {
        toast({ title: `⚠️${limit}`, variant: "error" });
        return;
      }

      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const code = axios.isAxiosError(error) ? (error.response?.data?.code as ArticleImportErrorCode | undefined) : undefined;
      if (status === 429) {
        toast({ title: `⚠️${t("materials.import.errors.tooMany")}`, variant: "error" });
        return;
      }
      if (code && CODES.includes(code)) {
        toast({ title: `⚠️${t(`materials.import.errors.${code}`)}`, variant: "error" });
        return;
      }

      logExceptionError(error, { section: "materials/import-url", userID: user?.id });
      toast({ title: `❌${t("materials.import.errors.generic")}`, variant: "error" });
    },
  });

  return { importMaterial: mutation.mutateAsync, importMaterialIsPending: mutation.isPending };
};
