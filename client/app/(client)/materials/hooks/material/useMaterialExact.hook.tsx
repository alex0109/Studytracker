import { useQuery } from "@tanstack/react-query";
import { getOneMaterialService } from "../../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";
import { IMaterial } from "@/app/types/material/material.type";
import { materialKeys } from "../querykeys/material.query.keys";

const useMaterialExact = (id: string) => {
  const { token, user } = useSession();

  const exactMaterial = useQuery<IMaterial, Error>({
    queryKey: materialKeys.detail(id),
    queryFn: () => getOneMaterialService(token, id),
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

export default useMaterialExact;
