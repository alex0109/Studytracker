"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { statisticsKeys } from "../lib/statistics-query-keys";
import { getStudyCalendar } from "../api";

export const useStudyCalendar = (from: string, to: string) => {
  const { token } = useSession();

  const calendar = useQuery({
    queryKey: statisticsKeys.calendar(from, to),
    queryFn: () => getStudyCalendar(token, from, to),
    enabled: !!token,
    // Moving between months keeps the old colours until the new ones arrive, without a flash of grey
    placeholderData: keepPreviousData,
  });

  return { studyCalendarData: calendar.data, studyCalendarIsPending: calendar.isPending };
};
