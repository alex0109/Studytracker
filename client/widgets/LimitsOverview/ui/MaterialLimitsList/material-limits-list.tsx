import { FC } from "react";
import Link from "next/link";
import { IMaterialLimitsUsage, IUserLimits } from "@/entities/limits";
import { LimitBar } from "@/shared/ui";

interface MaterialLimitsListProps {
  materials: IMaterialLimitsUsage[];
  limits: IUserLimits;
}

export const MaterialLimitsList: FC<MaterialLimitsListProps> = ({
  materials,
  limits,
}) => {
  if (materials.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No materials yet.{" "}
        <Link
          href="/materials"
          className="font-medium text-emerald-600 underline"
        >
          Create the first one
        </Link>
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
      {materials.map((material) => (
        <li
          key={material.materialId}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
        >
          <p className="truncate font-medium">{material.title}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LimitBar
              label="Questions"
              used={material.questions}
              max={limits.maxQuestionsPerMaterial}
            />
            <LimitBar
              label="Notes"
              used={material.notes}
              max={limits.maxNotesPerMaterial}
            />
            <LimitBar
              label="Dictionaries"
              used={material.dictionaries}
              max={limits.maxDictionariesPerMaterial}
            />
            <LimitBar
              label="Words in fullest dictionary"
              used={material.maxDictionaryEntries}
              max={limits.maxEntriesPerDictionary}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
