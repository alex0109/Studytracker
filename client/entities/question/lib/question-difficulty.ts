import { QuestionDifficultyEnum } from "../model";

// The API names levels "Easy", "Medium", "Hard"; translation keys and colours use the lowercase
// ones. Anything unknown is read as the default level rather than shown as a raw key
export const toQuestionDifficulty = (value: string | null | undefined): QuestionDifficultyEnum => {
  const normalized = value?.toLowerCase();

  return (Object.values(QuestionDifficultyEnum) as string[]).includes(normalized ?? "")
    ? (normalized as QuestionDifficultyEnum)
    : QuestionDifficultyEnum.Easy;
};
