import type { INoteResponse } from "@/entities/note/@x/ai";

export interface IEssayReviewResponse {
  // The essay with its new review
  note: INoteResponse;
}
