import axios from "axios";
import { IMaterialResponse } from "../model";

export const getAllMaterials = async (
  token: string | undefined,
): Promise<IMaterialResponse[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(res.data);

  return res.data;
};
