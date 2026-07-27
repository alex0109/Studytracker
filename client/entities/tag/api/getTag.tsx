import axios from "axios";
import { ITagResponse } from "../model";

export const getTag = async (
  token: string | undefined,
  id: string,
): Promise<ITagResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/tags/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
