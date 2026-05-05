import { useQuery } from "@tanstack/react-query";
import { getOneMaterialService } from "../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { IMaterial } from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";

const useMaterialExact = (id: string) => {
  const { token, user } = useSession();

  const exactMaterial = useQuery<IMaterial, Error>({
    queryKey: ["exact-material", id],
    queryFn: ({ queryKey }) => {
      return getOneMaterialService(token, queryKey[1] as string);
    },
    enabled: !!id && !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (exactMaterial.error) {
      logExceptionError(exactMaterial.error, {
        section: "materials/id",
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

export default useMaterialExact;
