import axios from "axios";
import { IMaterialResponse, IMaterialUpdate } from "../model";

export const updateMaterial = async (
  token: string | undefined,
  id: string,
  dataToUpdate: IMaterialUpdate,
): Promise<IMaterialResponse> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
