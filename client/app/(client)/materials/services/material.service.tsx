import { IMaterial } from "@/app/types/material/material.type";
import { ServerStatsDataType } from "@/app/types/stats/statistics.type";
import axios from "axios";

export const getAllMaterialsService = async (
  token: string | undefined,
): Promise<IMaterial[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/materials`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const getOneMaterialService = async (
  token: string | undefined,
  id: string,
): Promise<IMaterial> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  console.log("SERVICE DATA: ", res.data);

  return res.data;
};

export const createMaterialService = async (
  token: string | undefined,
  body: IMaterial,
): Promise<Partial<IMaterial>> => {
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

export const deleteMaterialService = async (
  token: string | undefined,
  id: string,
): Promise<void> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const updateMaterialService = async (
  token: string | undefined,
  id: string,
  dataToUpdate: Partial<IMaterial>,
): Promise<Partial<IMaterial>> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getStatsService = async (
  token: string | undefined,
): Promise<ServerStatsDataType> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/stats/data`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
