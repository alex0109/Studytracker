import axios from "axios";
import { Material } from "./type";
import { MaterialType } from "../components/material-carousel/types";

export const getAllMaterialsService = async (
  token: string | undefined
): Promise<MaterialType[]> => {
  const res = await axios.get("http://192.168.1.149:8000/materials", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const getOneMaterialService = async (
  token: string | undefined,
  id: number
): Promise<MaterialType> => {
  const res = await axios.get(`http://192.168.1.149:8000/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const createMaterialService = async (
  token: string | undefined,
  body: Material
): Promise<MaterialType> => {
  const res = await axios.post(
    `http://192.168.1.149:8000/materials`,
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
  const res = await axios.delete(`http://192.168.1.149:8000/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateMaterialService = async (
  token: string | undefined,
  id: number,
  dataToUpdate: Partial<Material>
): Promise<MaterialType> => {
  const res = await axios.patch(
    `http://192.168.1.149:8000/materials/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};
