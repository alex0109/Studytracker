import axios from "axios";
import { Material } from "./type";
import { MaterialType } from "../components/material-carousel/types";

export const getAllMaterialsService = async (): Promise<MaterialType[]> => {
  const res = await axios.get("http://192.168.1.149:8000/materials");

  return res.data;
};

export const getOneMaterialService = async (
  id: number
): Promise<MaterialType> => {
  const res = await axios.get(`http://192.168.1.149:8000/materials/${id}`);

  return res.data;
};

export const createMaterialService = async (
  body: Material
): Promise<MaterialType> => {
  const res = await axios.post(`http://192.168.1.149:8000/materials`, {
    id: 0,
    ...body,
  });

  return res.data;
};

export const deleteMaterialService = async (id: number): Promise<void> => {
  const res = await axios.delete(`http://192.168.1.149:8000/materials/${id}`);

  return res.data;
};

export const updateMaterialService = async ({
  id,
  dataToUpdate,
}: {
  id: number;
  dataToUpdate: Partial<Material>;
}): Promise<MaterialType> => {
  const res = await axios.patch(
    `http://192.168.1.149:8000/materials/${id}`,
    dataToUpdate
  );

  return res.data;
};
