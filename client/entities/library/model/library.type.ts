import type { MaterialTypeEnum } from "@/entities/material/model";
import type { NoteTypeEnum, IDrawingContent } from "@/entities/note/model";
import type { QuestionTypeEnum } from "@/entities/question/model";
import type { PartOfSpeechEnum } from "@/entities/dictionary/model";
import type { RichTextDocument } from "@/shared/types";

// Same values as the backend enums
export enum LibraryRequestTypeEnum {
  Publish = "Publish",
  Update = "Update",
  Remove = "Remove",
}

export enum LibraryRequestStatusEnum {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Cancelled = "Cancelled",
}

// Why a request was declined: shown to the author in their language
export enum LibraryRejectionReasonEnum {
  Content = "Content",
  Title = "Title",
  Nickname = "Nickname",
  Other = "Other",
}

export interface ILibraryItemSummary {
  id: string;
  title: string;
  type: MaterialTypeEnum;
  authorNickname: string;
  notesCount: number;
  questionsCount: number;
  dictionariesCount: number;
  wordsCount: number;
  importsCount: number;
  publishedAt: string;
  updatedAt: string;
  isMine: boolean;
  isImported: boolean;
}

// Frozen content of a library material: shown as it was sent, never edited
export interface ILibrarySnapshot {
  title: string;
  type: MaterialTypeEnum;
  link?: string | null;
  content?: RichTextDocument | null;
  notes: {
    key: number;
    title: string;
    type: NoteTypeEnum;
    textContent?: RichTextDocument | null;
    drawingContent?: IDrawingContent | null;
  }[];
  questions: {
    title: string;
    answer?: string | null;
    questionType: QuestionTypeEnum;
    questionDifficulty: string;
    explanation?: string | null;
    noteKey?: number | null;
    entryKey?: number | null;
    options: { name: string; position: number; isCorrect: boolean }[];
  }[];
  dictionaries: {
    title: string;
    description?: string | null;
    entries: {
      key: number;
      term: string;
      translation: string;
      transcription?: string | null;
      partOfSpeech?: PartOfSpeechEnum | null;
      grammarInfo?: string | null;
      example?: string | null;
      exampleTranslation?: string | null;
      note?: string | null;
      synonyms: string[];
      position: number;
    }[];
  }[];
}

export interface ILibraryItem extends ILibraryItemSummary {
  content: ILibrarySnapshot;
  // The author's request about it that waits for review
  pendingRequest?: LibraryRequestTypeEnum | null;
}

export interface ILibraryPage {
  items: ILibraryItemSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ILibraryPageParams {
  search?: string;
  type?: MaterialTypeEnum;
  page: number;
}

export interface ILibraryRequest {
  id: string;
  type: LibraryRequestTypeEnum;
  status: LibraryRequestStatusEnum;
  materialId?: string | null;
  libraryItemId?: string | null;
  title: string;
  materialType: MaterialTypeEnum;
  authorNickname: string;
  comment?: string | null;
  rejectionReason?: LibraryRejectionReasonEnum | null;
  reviewComment?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface ILibraryRequestCreate {
  type: LibraryRequestTypeEnum;
  materialId?: string;
  libraryItemId?: string;
  authorNickname?: string;
  comment?: string;
}
