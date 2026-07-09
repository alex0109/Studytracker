import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMaterial } from "../api";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { IMaterialResponse, materialKeys } from "../model";

export const useMaterialExact = (id: string) => {
  const { token, user } = useSession();

  const exactMaterial = useQuery<IMaterialResponse, Error>({
    queryKey: materialKeys.detail(id),
    queryFn: () => getMaterial(token, id),
    enabled: !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactMaterial.error) {
      logExceptionError(exactMaterial.error, {
        section: `materials/${id}`,
        userID: user?.id,
      });
    }
  }, [exactMaterial.error]);

  return {
    exactMaterial: exactMaterial.data,
    exactMaterialLoading: exactMaterial.isLoading,
    exactMaterialError: exactMaterial.error,
  };
};
