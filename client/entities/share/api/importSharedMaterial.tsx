import axios from "axios";
import { IMaterialResponse } from "@/entities/material/model";

export const importSharedMaterial = async (
  token: string | undefined,
  shareToken: string,
): Promise<IMaterialResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/shares/${encodeURIComponent(shareToken)}/import`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
