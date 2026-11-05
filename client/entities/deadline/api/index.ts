import axios from "axios";
import { IDeadlinePlan } from "../model/deadline-plan.type";

const API = process.env.NEXT_PUBLIC_API_HTTP;

export const getDeadlinePlan = async (token: string | undefined, materialId: string): Promise<IDeadlinePlan | null> => {
  const res = await axios.get(`${API}/materials/${materialId}/deadline-plan`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // A material without a deadline answers with an empty body
  return res.data || null;
};

export const getDeadlines = async (token: string | undefined): Promise<IDeadlinePlan[]> => {
  const res = await axios.get(`${API}/review/deadlines`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const setMaterialDeadline = async (
  token: string | undefined,
  materialId: string,
  deadline: string | null,
): Promise<void> => {
  await axios.put(
    `${API}/materials/${materialId}/deadline`,
    { deadline },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
