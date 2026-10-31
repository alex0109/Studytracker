import axios from "axios";
import {
  ILibraryItem,
  ILibraryPage,
  ILibraryPageParams,
  ILibraryRequest,
  ILibraryRequestCreate,
} from "../model";
import { IMaterialResponse } from "@/entities/material/model";

const auth = (token: string | undefined) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const LIBRARY_PAGE_SIZE = 24;

export const getLibraryPage = async (
  token: string | undefined,
  { search, type, page }: ILibraryPageParams,
): Promise<ILibraryPage> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/library`, {
    ...auth(token),
    params: { search: search || undefined, type, page, pageSize: LIBRARY_PAGE_SIZE },
  });

  return res.data;
};

export const getLibraryItem = async (
  token: string | undefined,
  itemId: string,
): Promise<ILibraryItem> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/library/${itemId}`, auth(token));

  return res.data;
};

export const importLibraryItem = async (
  token: string | undefined,
  itemId: string,
): Promise<IMaterialResponse> => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP}/library/${itemId}/import`, null, auth(token));

  return res.data;
};

export const getMyLibraryRequests = async (
  token: string | undefined,
): Promise<ILibraryRequest[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/library/requests`, auth(token));

  return res.data;
};

export const createLibraryRequest = async (
  token: string | undefined,
  body: ILibraryRequestCreate,
): Promise<ILibraryRequest> => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP}/library/requests`, body, auth(token));

  return res.data;
};

export const cancelLibraryRequest = async (
  token: string | undefined,
  requestId: string,
): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_HTTP}/library/requests/${requestId}`, auth(token));
};
