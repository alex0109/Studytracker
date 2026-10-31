import axios from "axios";
import { IMaterialResponse } from "../model";

export interface IMaterialImportResult {
  material: IMaterialResponse;
  questionsCreated: number;
  // Why no questions were made when they were asked for
  questionsSkipped: "quota" | "unavailable" | "failed" | null;
}

// Error codes of a failed import, translated under "materials.import.errors"
export type ArticleImportErrorCode =
  | "InvalidUrl"
  | "BlockedAddress"
  | "Unreachable"
  | "Timeout"
  | "TooLarge"
  | "NotHtml"
  | "NotAnArticle"
  | "VideoNotSupported";

// The server fetches the page and keeps only the article's text
export const importMaterial = async (
  token: string | undefined,
  body: { url: string; generateQuestions: boolean },
): Promise<IMaterialImportResult> =>
  (
    await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP}/materials/import-url`, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
