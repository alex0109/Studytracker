import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterialService } from "../../services/material.service";

import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { materialKeys } from "../querykeys/material.query.keys";

const useMaterialDelete = (id: string) => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const deleteMaterialMutation = useMutation({
    mutationFn: () => deleteMaterialService(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: `materials/${id} (delete)`,
        userID: user?.id,
      });
    },
  });

  return {
    deleteMaterial: deleteMaterialMutation.mutate,
  };
};

export default useMaterialDelete;
