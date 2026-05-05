import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterialService } from "../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { IMaterial } from "@/app/types/types";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";

const useMaterialUpdate = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const updateMaterialMutation = useMutation({
    mutationFn: ({
      id,
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: Partial<IMaterial>;
    }) => updateMaterialService(token, id, dataToUpdate),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["materials", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/update",
        userID: user?.id,
      });
    },
  });

  return {
    updateMaterial: updateMaterialMutation.mutate,
  };
};

export default useMaterialUpdate;
