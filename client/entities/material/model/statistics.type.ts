export interface IStatistics {
  count: number;
  types: {
    summary?: number;
    video?: number;
    article?: number;
    practice?: number;
    test?: number;
  };
  statuses: { tolearn?: number; inprocess?: number; finished?: number };
}
