// Same values as backend FeedbackCategory
export type FeedbackCategory = "Idea" | "Bug" | "Praise" | "Other";

export interface IFeedbackCreate {
  name?: string;
  email?: string;
  message: string;
  category: FeedbackCategory;
  // Hidden field, bots fill it, people don't
  website?: string;
}
