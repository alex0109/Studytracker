import type { QuestionTypeEnum } from "@/entities/question/model/question-type.type";

export interface IQuestionGenerate {
  // Questions come from this note, or from the material content when empty
  noteId?: string;
  // From the subtitles of the material's video: every question gets its moment
  fromVideo?: boolean;
  count: number;
  // Empty mixes all types
  questionType?: QuestionTypeEnum;
}
