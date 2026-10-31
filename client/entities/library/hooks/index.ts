"use client";

import { useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/context/session.provider";
import { logExceptionError } from "@/shared/lib/exeption.sentry";
import { getLibraryItem, getLibraryPage, getMyLibraryRequests } from "../api";
import { libraryKeys } from "../lib";
import { ILibraryItem, ILibraryPage, ILibraryPageParams, ILibraryRequest } from "../model";

export const useLibraryPage = (params: ILibraryPageParams) => {
  const { token, user } = useSession();

  const page = useQuery<ILibraryPage, Error>({
    queryKey: libraryKeys.list(params),
    queryFn: () => getLibraryPage(token, params),
    enabled: !!token,
    // The previous results stay while the next search or page loads
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (page.error) logExceptionError(page.error, { section: "library", userID: user?.id });
  }, [page.error, user?.id]);

  return {
    libraryPageData: page.data,
    libraryPageIsPending: page.isPending,
    libraryPageIsFetching: page.isFetching,
    libraryPageError: page.error,
  };
};

export const useLibraryItem = (itemId: string) => {
  const { token, user } = useSession();

  const item = useQuery<ILibraryItem, Error>({
    queryKey: libraryKeys.detail(itemId),
    queryFn: () => getLibraryItem(token, itemId),
    enabled: !!token && !!itemId,
    // Library content never changes in place, only through a reviewed request
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (item.error) logExceptionError(item.error, { section: `library/${itemId}`, userID: user?.id });
  }, [item.error, itemId, user?.id]);

  return {
    libraryItemData: item.data,
    libraryItemIsPending: item.isPending,
    libraryItemError: item.error,
  };
};

export const useMyLibraryRequests = () => {
  const { token, user } = useSession();

  const requests = useQuery<ILibraryRequest[], Error>({
    queryKey: libraryKeys.requests(),
    queryFn: () => getMyLibraryRequests(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (requests.error) logExceptionError(requests.error, { section: "library/requests", userID: user?.id });
  }, [requests.error, user?.id]);

  return {
    libraryRequestsData: requests.data,
    libraryRequestsIsPending: requests.isPending,
  };
};
