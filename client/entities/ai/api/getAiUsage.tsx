import axios from "axios";
import { IAiUsage } from "../model";

export const getAiUsage = async (
  token: string | undefined,
): Promise<IAiUsage> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/ai/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
