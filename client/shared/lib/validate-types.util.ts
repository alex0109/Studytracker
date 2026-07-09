import { ServerStatsDataType } from "@/entities/material/model/statistics.type";

export const validateTypesData = (
  data: ServerStatsDataType | undefined,
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
