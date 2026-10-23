export interface IFlashcardStats {
  total: number;
  new: number;
  learning: number;
  review: number;
  relearning: number;
  // Reviewed cards whose due date has come, new cards are not included
  due: number;
}
