import axios from "axios";
import { IAssessment } from "@/app/types/assessment/assessment.type";

export const getAllAssessmentsService = async (
  token: string | undefined,
  materialId: string,
): Promise<IAssessment[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/assessments`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getOneAssessmentService = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<IAssessment> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const createAssessmentService = async (
  token: string | undefined,
  materialId: string,
  body: Partial<IAssessment>,
): Promise<Partial<IAssessment>> => {
  const date = new Date();

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/assessments`,
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

export const updateAssessmentService = async (
  token: string | undefined,
  materialId: string,
  id: string,
  dataToUpdate: Partial<IAssessment>,
): Promise<Partial<IAssessment>> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/assessments/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const deleteAssessmentService = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<void> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
