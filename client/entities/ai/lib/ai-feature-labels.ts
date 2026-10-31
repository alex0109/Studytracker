import { AiFeatureEnum } from "../model";

// Feature names are translated under "ai.features"
export const aiFeatureLabelKey = (feature: AiFeatureEnum) =>
  `ai.features.${feature}` as const;
