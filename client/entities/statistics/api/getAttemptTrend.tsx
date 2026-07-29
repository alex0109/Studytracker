import axios from "axios";
import { IAttemptTrendPoint } from "../model/attempt-trend-point";

export const getAttemptTrend = async (
  token: string | undefined,
): Promise<IAttemptTrendPoint[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/trend`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
