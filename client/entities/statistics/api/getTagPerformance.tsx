import axios from "axios";
import { ITagPerformance } from "../model/tag-performance";

export const getTagPerformance = async (
  token: string | undefined,
): Promise<ITagPerformance[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/tags`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
