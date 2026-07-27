import axios from "axios";
import { IMaterialResponse } from "../model";

export const addTagToMaterial = async (
  token: string | undefined,
  materialId: string,
  tagId: string,
): Promise<IMaterialResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/tags/${tagId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
