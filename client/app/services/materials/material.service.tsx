import axios from "axios";
import { Material } from "./type";

export const getAllMaterials = async () => {
  const res = await axios.get("http://192.168.1.149:8000/materials");

  return res.data;
};

export const getOneMaterial = async (id: number) => {
  const res = await axios.get(`http://192.168.1.149:8000/materials/${id}`);

  console.log(res.data);

  return res.data[0];
};

export const createMaterial = async (body: Material) => {
  const res = await axios.post(`http://192.168.1.149:8000/materials`, {
    id: 0,
    ...body,
  });

  console.log(res.data);

  return res.data[0];
};
