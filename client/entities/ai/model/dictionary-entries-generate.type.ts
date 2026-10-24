export interface IDictionaryEntriesGenerate {
  // Words come from this note of the same material, or from the material content when empty
  noteId?: string;
  count: number;
  // Language name in English, e.g. "Ukrainian"
  language: string;
}
