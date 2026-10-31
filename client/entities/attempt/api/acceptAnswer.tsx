import axios from "axios";
import { IAttempt } from "../model";

const url = (attemptId: string, resultId: string) =>
  `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/${attemptId}/results/${resultId}/accept`;

// The user accepts an open answer the automatic check rejected; the updated attempt comes back
export const acceptAnswer = async (
  token: string | undefined,
  attemptId: string,
  resultId: string,
): Promise<IAttempt> =>
  (await axios.post(url(attemptId, resultId), {}, { headers: { Authorization: `Bearer ${token}` } })).data;

export const undoAcceptAnswer = async (
  token: string | undefined,
  attemptId: string,
  resultId: string,
): Promise<IAttempt> =>
  (await axios.delete(url(attemptId, resultId), { headers: { Authorization: `Bearer ${token}` } })).data;
