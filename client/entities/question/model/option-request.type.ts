// Option without id is created, option missing from the list is removed
export interface IOptionRequest {
  id?: string;
  name: string;
  isCorrect: boolean;
}
