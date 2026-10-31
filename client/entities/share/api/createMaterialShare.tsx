import axios from "axios";
import { IMaterialShare } from "../model";

export const createMaterialShare = async (
  token: string | undefined,
  materialId: string,
): Promise<IMaterialShare> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/share`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
