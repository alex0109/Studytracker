import axios from "axios";
import {
  IQuestion,
  IQuestionReduced,
} from "@/app/types/question/question.type";

export const getAllQuestionsService = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestion[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getReducedQuestionsService = async (
  token: string | undefined,
  materialId: string,
): Promise<IQuestionReduced[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/assessment`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getOneQuestionService = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<IQuestion> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const createQuestionService = async (
  token: string | undefined,
  materialId: string,
  body: Partial<IQuestion>,
): Promise<Partial<IQuestion>> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions`,
    { ...body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const updateQuestionService = async (
  token: string | undefined,
  materialId: string,
  id: string,
  dataToUpdate: Partial<IQuestion>,
): Promise<Partial<IQuestion>> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const deleteQuestionService = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<void> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
