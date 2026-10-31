import axios from "axios";
import { IUserLimits } from "../model";

export const getLimits = async (
  token: string | undefined,
): Promise<IUserLimits> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/limits`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
