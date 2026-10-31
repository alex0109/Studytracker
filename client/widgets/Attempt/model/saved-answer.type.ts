// Answer the server already has for a question of the attempt
export interface ISavedAnswer {
  text?: string;
  optionIds: string[];
  // How many times the answer was changed after the first save
  changes: number;
}
