import { ServerStatsDataType } from "@/app/types/stats/statistics.type";
import axios from "axios";

export const getAdminStatsService = async (
  token: string | undefined,
): Promise<ServerStatsDataType> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/admin/stats`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
