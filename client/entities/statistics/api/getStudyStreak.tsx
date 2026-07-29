import axios from "axios";
import { IStudyStreak } from "../model/study-streak";

export const getStudyStreak = async (
  token: string | undefined,
): Promise<IStudyStreak> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/streak`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
