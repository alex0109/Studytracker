import axios from "axios";
import { ILimitsUsage } from "../model";

export const getLimitsUsage = async (
  token: string | undefined,
): Promise<ILimitsUsage> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/limits/usage`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
