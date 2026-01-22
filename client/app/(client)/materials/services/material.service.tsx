import axios from "axios";
import { Material } from "./type";
import { MaterialType, ServerStatsDataType } from "@/app/types/types";

export const getAllMaterialsService = async (
  token: string | undefined
): Promise<MaterialType[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.map((item: any) => {
    return { ...item, id: item._id };
  });
};

export const getOneMaterialService = async (
  token: string | undefined,
  id: string
): Promise<MaterialType> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return { ...res.data, id: res.data._id };
};

export const createMaterialService = async (
  token: string | undefined,
  body: Material
): Promise<MaterialType> => {
  const date = new Date();

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials`,
    {
      id: 0,
      ...body,
      created_at: date.toISOString(),
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
  id: string
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
  id: string,
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
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/stats/data`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};
