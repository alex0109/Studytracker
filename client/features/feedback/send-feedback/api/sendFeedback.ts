import axios from "axios";
import { IFeedbackCreate } from "../model/feedback.type";

// Works without an account: the landing page has the form too
export const sendFeedback = async (
  token: string | undefined,
  body: IFeedbackCreate,
): Promise<void> => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP}/feedback`, body, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
