export interface IMaterialLimitsUsage {
  materialId: string;
  title: string;
  questions: number;
  notes: number;
  dictionaries: number;
  // Words of the fullest dictionary of the material
  maxDictionaryEntries: number;
}

// What the user already uses, counted the same way the server checks limits
export interface ILimitsUsage {
  // Own materials; library copies are counted apart unless they share the material limit
  materials: number;
  libraryCopies?: number;
  tags: number;
  materialsUsage: IMaterialLimitsUsage[];
}
