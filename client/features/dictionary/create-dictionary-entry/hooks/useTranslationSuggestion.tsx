"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context";
import { aiKeys, SubscriptionTierEnum, translateWord, useAiUsage } from "@/entities/ai";
import { useProfile } from "@/entities/profile";

// Auto-translation for a word being added: on for Plus (and Duo) unless switched off in Account;
// on Free the form shows a small hint instead. Failures are silent: the field is just left empty
export const useTranslationSuggestion = () => {
  const queryClient = useQueryClient();
  const { token } = useSession();
  const { profileData } = useProfile();
  const { aiUsageData } = useAiUsage();

  const switchedOn = profileData?.autoTranslate ?? true;
  const isFree = !aiUsageData || aiUsageData.tier === SubscriptionTierEnum.Free;
  const enabled = switchedOn && !isFree && !!aiUsageData?.isEnabled;

  const suggest = useCallback(
    async (term: string, signal: AbortSignal) => {
      try {
        const result = await translateWord(token, term, signal);
        if (result.translation) queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
        return result.translation;
      } catch {
        // Cancelled by the next keystroke, or AI down: nothing to suggest
        return null;
      }
    },
    [token, queryClient],
  );

  return { enabled, showPlusHint: switchedOn && !!aiUsageData && isFree, suggest };
};
