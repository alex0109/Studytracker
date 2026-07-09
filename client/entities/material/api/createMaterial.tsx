import axios from "axios";
import { IMaterialCreate, IMaterialResponse } from "../model";

export const createMaterial = async (
  token: string | undefined,
  body: IMaterialCreate,
): Promise<IMaterialResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials`,
    {
      ...body,
      description: null,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
