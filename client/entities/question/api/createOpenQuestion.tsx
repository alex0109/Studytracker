import axios from "axios";
import { IOpenQuestionRequest, IQuestionResponse } from "../model";

export const createOpenQuestion = async (
  token: string | undefined,
  materialId: string,
  body: IOpenQuestionRequest,
): Promise<IQuestionResponse> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/open`,
    { ...body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
