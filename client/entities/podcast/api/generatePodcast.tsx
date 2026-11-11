import axios from "axios";
import { IPodcast } from "../model";

// The script is written during this request (up to a minute); the voices are recorded afterwards
export const generatePodcast = async (
  token: string | undefined,
  materialId: string,
  language: string,
): Promise<IPodcast> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/podcast`,
    { language },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

// Records the saved script again after a failure; it doesn't spend the quota
export const retryPodcast = async (token: string | undefined, materialId: string): Promise<IPodcast> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/podcast/retry`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
