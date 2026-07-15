import axios from "axios";
import { ITagResponse } from "../model";

export const getAllTags = async (
  token: string | undefined,
): Promise<ITagResponse[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/tags`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
