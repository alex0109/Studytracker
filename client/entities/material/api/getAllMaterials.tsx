import axios from "axios";
import { IMaterialResponse } from "../model";

// Without material and note content: the list stays small however much is written.
// The opened material and note load their content separately
export const getAllMaterials = async (
  token: string | undefined,
): Promise<IMaterialResponse[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials`, {
    params: { includeContent: false },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
