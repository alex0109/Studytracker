import { ServerStatsDataType } from "@/app/types/types";

export const validateTypesData = (
  data: ServerStatsDataType | undefined
): { x: string; y: number }[] => {
  const validatedData = [];

  if (!data) {
    return [{ x: "No data", y: 0 }];
  }

  for (let i = 0; i < Object.values(data.types).length; i++) {
    validatedData.push({
      x:
        String(Object.keys(data.types)[i]).charAt(0).toUpperCase() +
        String(Object.keys(data.types)[i]).slice(1),
      y: Object.values(data.types)[i],
    });
  }

  return validatedData;
};

export const validateStatusesData = (
  data: ServerStatsDataType | undefined
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
