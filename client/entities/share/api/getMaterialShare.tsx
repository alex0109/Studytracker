import axios from "axios";
import { IMaterialShare } from "../model";

// Material without an active link answers 404, which means "not shared yet"
export const getMaterialShare = async (
  token: string | undefined,
  materialId: string,
): Promise<IMaterialShare | null> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/share`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};
