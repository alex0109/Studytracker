import { IStatistics } from "../model";

export const validateStatuses = (
  data: IStatistics | undefined,
): { x: string; y: number }[] => {
  const validatedData = [];

  if (!data) {
    return [{ x: "No data", y: 0 }];
  }

  for (let i = 0; i < Object.values(data.statuses).length; i++) {
    validatedData.push({
      x:
        String(Object.keys(data.statuses)[i]).charAt(0).toUpperCase() +
        String(Object.keys(data.statuses)[i]).slice(1),
      y: Object.values(data.statuses)[i],
    });
  }

  return validatedData;
};
