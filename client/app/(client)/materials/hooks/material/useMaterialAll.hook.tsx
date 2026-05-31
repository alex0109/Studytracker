import { useQuery } from "@tanstack/react-query";
import { getAllMaterialsService } from "../../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { useEffect } from "react";
import { IMaterial } from "@/app/types/material/material.type";
import { materialKeys } from "../querykeys/material.query.keys";

const useMaterialAll = () => {
  const { token, user } = useSession();

  const materials = useQuery<IMaterial[]>({
    queryKey: materialKeys.all,
    queryFn: () => getAllMaterialsService(token),
    enabled: !!token,
    staleTime: 5000,
  });

  useEffect(() => {
    if (materials.error) {
      logExceptionError(materials.error, {
        section: "materials",
        userID: user?.id,
      });
    }
  }, [materials.error]);

  return {
    materialsData: materials.data,
    materialsLoading: materials.isLoading,
    materialsError: materials.error,
  };
};

export default useMaterialAll;
