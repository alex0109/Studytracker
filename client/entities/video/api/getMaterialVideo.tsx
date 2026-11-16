import axios from "axios";
import { IMaterialVideo } from "../model";

// No subtitles yet is an empty answer, not an error
export const getMaterialVideo = async (token: string | undefined, materialId: string): Promise<IMaterialVideo | null> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/video`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.status === 204 || !res.data ? null : res.data;
};
