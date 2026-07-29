import axios from "axios";
import { IDifficultyStat } from "../model/difficulty-stat";

export const getDifficultyBreakdown = async (
  token: string | undefined,
): Promise<IDifficultyStat[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/difficulty`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
