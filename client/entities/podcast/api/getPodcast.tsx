import axios from "axios";
import { IPodcast } from "../model";

// No podcast yet is an empty answer, not an error
export const getPodcast = async (token: string | undefined, materialId: string): Promise<IPodcast | null> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/podcast`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.status === 204 || !res.data ? null : res.data;
};
