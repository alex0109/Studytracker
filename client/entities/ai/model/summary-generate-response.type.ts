import type { INoteResponse } from "@/entities/note/@x/ai";

export interface ISummaryGenerateResponse {
  note: INoteResponse;
  // The material was too long and only its beginning was summarized
  isContentTruncated: boolean;
}
