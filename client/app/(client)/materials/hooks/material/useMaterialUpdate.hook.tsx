import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterialService } from "../../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";

import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IMaterial } from "@/app/types/material/material.type";
import { materialKeys } from "../querykeys/material.query.keys";

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
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (update)`,
        userID: user?.id,
      });
    },
  });

  return {
    updateMaterial: updateMaterialMutation.mutate,
  };
};

export default useMaterialUpdate;
