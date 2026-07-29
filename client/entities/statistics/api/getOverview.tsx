import axios from "axios";
import { IStatisticsOverview } from "../model/statistics-overview";

export const getOverview = async (
  token: string | undefined,
): Promise<IStatisticsOverview> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/overview`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
