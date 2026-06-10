import { IAssessment } from "@/app/types/assessment/assessment.type";
import { IResult } from "@/app/types/result/result.type";
import axios from "axios";

export const startAssessmentService = async (
  token: string | undefined,
  id: string,
): Promise<{ id: string }> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/start`,
    { id },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getAssessmentService = async (
  token: string | undefined,
  id: string,
): Promise<IAssessment> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  console.log("SERVICE DATA: ", res.data);

  return res.data;
};

export const submitAnswerService = async (
  token: string | undefined,
  id: string,
  body: IResult,
): Promise<void> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
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

export const finishAssessmentService = async (
  token: string | undefined,
  id: string,
): Promise<void> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getAssessmentResultsService = async (
  token: string | undefined,
  id: string,
): Promise<IResult[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
