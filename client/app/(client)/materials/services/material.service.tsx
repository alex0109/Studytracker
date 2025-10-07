import axios from "axios";
import { Material } from "./type";
import { MaterialType, ServerStatsDataType } from "@/app/types/types";

export const getAllMaterialsService = async (
  token: string | undefined
): Promise<MaterialType[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const getOneMaterialService = async (
  token: string | undefined,
  id: number
): Promise<MaterialType> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

export const createMaterialService = async (
  token: string | undefined,
  body: Material
): Promise<MaterialType> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials`,
    {
      id: 0,
      ...body,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteMaterialService = async (
  token: string | undefined,
  id: number
): Promise<void> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

export const updateMaterialService = async (
  token: string | undefined,
  id: number,
  dataToUpdate: Partial<Material>
): Promise<MaterialType> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

export const getStatsService = async (
  token: string | undefined
): Promise<ServerStatsDataType> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
