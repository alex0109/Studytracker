import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaterialService } from "../../services/material.service";
import { useSession } from "@/shared/context/session-provider.context";
import { logExceptionError } from "@/shared/lib/utils/exeption.sentry";
import { IMaterial } from "@/app/types/material/material.type";
import { materialKeys } from "../querykeys/material.query.keys";

const useMaterialCreate = () => {
  const queryClient = useQueryClient();
  const { token, user } = useSession();

  const createMaterialMutation = useMutation({
    mutationFn: (body: IMaterial) => createMaterialService(token, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
    onError: (error) => {
      logExceptionError(error, {
        section: "materials/ (create)",
        userID: user?.id,
      });
    },
  });

  return {
    createMaterial: createMaterialMutation.mutate,
  };
};

export default useMaterialCreate;
