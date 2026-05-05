import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaterialService } from "../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { IMaterial } from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";

const useMaterialCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterial) => createMaterialService(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/create",
        userID: user?.id,
      });
    },
  });

  return {
    createMaterial: createMaterialMutation.mutate,
  };
};

export default useMaterialCreate;
