// Settings of the person: time zone, languages, how they appear in the library
export interface IProfile {
  // Null until the browser sent it for the first time
  timeZone: string | null;
  interfaceLanguage: string;
  // Saved choice: a language code, "question", or null for the interface language
  explanationLanguage: string | null;
  // What AI explanations are written in right now
  effectiveExplanationLanguage: string;
  nativeLanguage: string | null;
  studyLanguage: string | null;
  nickname: string | null;
  dailyGoal: number | null;
  // Learning settings; null means the default from `defaults`
  desiredRetention: number | null;
  newCardsPerDay: number | null;
  maxReviewsPerDay: number | null;
  dailyReminderHour: number | null;
  streakReminderHour: number | null;
  streakFreezesPerMonth: number | null;
  defaults: ILearningDefaults;
}

export interface ILearningDefaults {
  desiredRetention: number;
  dailyReminderHour: number;
  streakReminderHour: number;
  streakFreezesPerMonth: number;
  minRetention: number;
  maxRetention: number;
}

// Only sent fields change; "" clears a text field, 0 clears the goal
export interface IProfileUpdate {
  timeZone?: string;
  interfaceLanguage?: string;
  explanationLanguage?: string;
  nativeLanguage?: string;
  studyLanguage?: string;
  nickname?: string;
  dailyGoal?: number;
  // 0 clears the retention, -1 clears the other numbers
  desiredRetention?: number;
  newCardsPerDay?: number;
  maxReviewsPerDay?: number;
  dailyReminderHour?: number;
  streakReminderHour?: number;
  streakFreezesPerMonth?: number;
}

// Explain in the language of the question, the way it worked before the setting
export const QUESTION_LANGUAGE = "question";

// Codes the server accepts for explanations; names are shown in the language itself
export const EXPLANATION_LANGUAGES: { code: string; name: string }[] = [
  { code: "en-GB", name: "English" },
  { code: "uk", name: "Українська" },
  { code: "nb", name: "Norsk bokmål" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
];
