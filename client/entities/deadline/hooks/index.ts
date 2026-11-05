"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { deadlineKeys } from "../lib";
import { getDeadlinePlan, getDeadlines } from "../api";

export const useDeadlinePlan = (materialId: string) => {
  const { token } = useSession();

  const plan = useQuery({
    queryKey: deadlineKeys.plan(materialId),
    queryFn: () => getDeadlinePlan(token, materialId),
    enabled: !!token,
  });

  return { deadlinePlanData: plan.data, deadlinePlanIsPending: plan.isPending };
};

export const useDeadlines = () => {
  const { token } = useSession();

  const deadlines = useQuery({
    queryKey: deadlineKeys.list(),
    queryFn: () => getDeadlines(token),
    enabled: !!token,
  });

  return { deadlinesData: deadlines.data, deadlinesIsPending: deadlines.isPending };
};
