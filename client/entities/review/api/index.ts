import axios from "axios";
import type {
  IFlashcardSessionCreate,
  IFlashcardSessionResponse,
} from "@/entities/flashcard";
import type { IResultRequest } from "@/entities/attempt";
import {
  IQuestionReviewSession,
  IReviewAnswerResult,
  IReviewToday,
} from "../model";

const base = () => `${process.env.NEXT_PUBLIC_API_HTTP}/review`;
const auth = (token: string | undefined) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getReviewToday = async (
  token: string | undefined,
): Promise<IReviewToday> => (await axios.get(`${base()}/today`, auth(token))).data;

// Words from every dictionary; answers then go through the usual flashcard session endpoints
export const startTodayWords = async (
  token: string | undefined,
  body: IFlashcardSessionCreate,
): Promise<IFlashcardSessionResponse> =>
  (await axios.post(`${base()}/today/words`, body, auth(token))).data;

export const startQuestionReview = async (
  token: string | undefined,
  limit?: number,
): Promise<IQuestionReviewSession> =>
  (await axios.post(`${base()}/today/questions`, { limit }, auth(token))).data;

export const answerReviewQuestion = async (
  token: string | undefined,
  sessionId: string,
  body: IResultRequest,
): Promise<IReviewAnswerResult> =>
  (await axios.post(`${base()}/sessions/${sessionId}/answer`, body, auth(token))).data;

export const finishQuestionReview = async (
  token: string | undefined,
  sessionId: string,
): Promise<void> => {
  await axios.post(`${base()}/sessions/${sessionId}/finish`, {}, auth(token));
};
