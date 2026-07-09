import axios from "axios";
import { IResultRequest } from "../model";

export const submitAnswer = async (
  token: string | undefined,
  attemptId: string,
  body: Partial<IResultRequest>,
): Promise<boolean> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${attemptId}/answer`,
    {
      ...body,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
