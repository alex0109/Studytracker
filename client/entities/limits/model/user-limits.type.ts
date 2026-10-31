// Limits of the user's plan, same values as the backend; null means no limit
export interface IUserLimits {
  tier?: "Free" | "Plus" | "Pro";
  maxMaterials: number | null;
  maxTags: number | null;
  maxQuestionsPerMaterial: number | null;
  maxNotesPerMaterial: number | null;
  maxDictionariesPerMaterial: number | null;
  maxEntriesPerDictionary: number | null;
  maxLibraryImports?: number | null;
  // When false, library copies don't take places of the user's own materials
  countLibraryImports?: boolean;
}
