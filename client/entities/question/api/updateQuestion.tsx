import axios from "axios";
import { IQuestionResponse } from "../model";
import { IQuestionUpdate } from "../model/question-update.type";

export const updateQuestion = async (
  token: string | undefined,
  materialId: string,
  id: string,
  dataToUpdate: IQuestionUpdate,
): Promise<IQuestionResponse> => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    dataToUpdate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
