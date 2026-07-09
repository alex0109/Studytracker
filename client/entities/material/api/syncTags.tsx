import axios from "axios";
import { IMaterial } from "../model";

export const syncTags = async (
  token: string | undefined,
  id: string,
  dataToUpdate: string[],
): Promise<IMaterial> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}/tags`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
