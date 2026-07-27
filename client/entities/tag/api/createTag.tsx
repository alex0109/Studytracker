import axios from "axios";
import { ITagResponse, ITagCreate } from "../model";

export const createTag = async (
  token: string | undefined,
  body: ITagCreate,
): Promise<ITagResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/tags`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
