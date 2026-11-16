import axios from "axios";
import { IMaterialVideo } from "../model";

// The AI watches the video during this request: up to a few minutes for a long one
export const processMaterialVideo = async (token: string | undefined, materialId: string): Promise<IMaterialVideo> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/ai/materials/${materialId}/video`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
