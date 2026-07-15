import axios from "axios";
import { ITagResponse } from "../model";
import { ITagUpdate } from "../model/tag-update.type";

export const updateTag = async (
  token: string | undefined,
  id: string,
  dataToUpdate: ITagUpdate,
): Promise<ITagResponse> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/tags/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
