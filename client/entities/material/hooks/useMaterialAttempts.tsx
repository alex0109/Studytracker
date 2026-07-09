import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttempts } from "../api";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { materialKeys } from "../model";
import { IAttempt } from "@/entities/attempt";

export const useMaterialAttempts = (id: string) => {
  const { token, user } = useSession();

  const attempts = useQuery<IAttempt[], Error>({
    queryKey: materialKeys.detail(id),
    queryFn: () => getAttempts(token, id),
    enabled: !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (attempts.error) {
      logExceptionError(attempts.error, {
        section: `materials/${id}/attempts`,
        userID: user?.id,
      });
    }
  }, [attempts.error]);

  return {
    attempts: attempts.data,
    attemptsLoading: attempts.isLoading,
    attemptsError: attempts.error,
  };
};
