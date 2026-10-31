// Where a question is in spaced repetition, same states as the backend (FSRS).
// Absent until the question is answered in a finished attempt
export interface IQuestionProgress {
  state: "New" | "Learning" | "Review" | "Relearning";
  due: string;
  reps: number;
  lapses: number;
  isLeech: boolean;
}
