import axios from "axios";
import { ISharedMaterialPreview } from "../model";

// Works without a user as well, the token only adds isOwner and isAlreadyImported
export const getSharedMaterialPreview = async (
  token: string | undefined,
  shareToken: string,
): Promise<ISharedMaterialPreview | null> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HTTP}/shares/${encodeURIComponent(shareToken)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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
