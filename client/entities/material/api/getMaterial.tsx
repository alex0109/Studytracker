import axios from "axios";
import { IMaterialResponse } from "../model";

export const getMaterial = async (
  token: string | undefined,
  id: string,
): Promise<IMaterialResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
