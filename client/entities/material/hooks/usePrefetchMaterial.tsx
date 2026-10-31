"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { getMaterial } from "../api";
import { materialKeys } from "../lib";

// Starts loading a material's content on hover or focus, so it's usually there by the click
export const usePrefetchMaterial = () => {
  const queryClient = useQueryClient();
  const { token } = useSession();

  return (id: string) => {
    if (!token) return;

    void queryClient.prefetchQuery({
      queryKey: materialKeys.detail(id),
      queryFn: () => getMaterial(token, id),
      staleTime: 30_000,
    });
  };
};
