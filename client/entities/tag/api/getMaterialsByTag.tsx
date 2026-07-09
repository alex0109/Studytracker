import axios from "axios";
import { IMaterialResponse } from "@/entities/material";

export const getMaterialsByTag = async (
  token: string | undefined,
  id: string,
): Promise<IMaterialResponse[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/tags/${id}/materials`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
