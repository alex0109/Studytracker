import axios from "axios";
import { IAssessment } from "../model/assessment.type";

export const getAssessment = async (
  token: string | undefined,
  id: string,
): Promise<IAssessment> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
