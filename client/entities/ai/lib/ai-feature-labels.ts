import { AiFeatureEnum } from "../model";

export const aiFeatureLabels: Record<AiFeatureEnum, string> = {
  [AiFeatureEnum.QuestionGeneration]: "Question generation",
  [AiFeatureEnum.DictionaryGeneration]: "Word generation",
  [AiFeatureEnum.AnswerGrading]: "Answer checks by meaning",
  [AiFeatureEnum.SummaryGeneration]: "Summary generation",
  [AiFeatureEnum.MistakeExplanation]: "Mistake explanations",
};
