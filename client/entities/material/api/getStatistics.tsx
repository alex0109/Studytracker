import axios from "axios";
import { IStatistics } from "../model";

export const getStatistics = async (
  token: string | undefined,
): Promise<IStatistics> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/stats/data`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
