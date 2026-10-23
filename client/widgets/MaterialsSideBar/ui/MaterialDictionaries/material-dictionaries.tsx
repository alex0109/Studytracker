"use client";

import { FC } from "react";
import { LuBookA } from "react-icons/lu";
import { IDictionaryResponse, useDictionaryAll } from "@/entities/dictionary";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/radix-ui";
import { cn } from "@/shared/lib/utils";

interface MaterialDictionariesProps {
  materialId: string;
  enabled: boolean;
  activeDictionaryId?: string;
  onSelect: (dictionary: IDictionaryResponse) => void;
}

export const MaterialDictionaries: FC<MaterialDictionariesProps> = ({
  materialId,
  enabled,
  activeDictionaryId,
  onSelect,
}) => {
  const { dictionariesData, dictionariesIsPending } = useDictionaryAll(
    materialId,
    enabled,
  );

  if (enabled && dictionariesIsPending) {
    return <Skeleton className="w-full h-8" />;
  }

  return (
    <>
      {dictionariesData &&
        dictionariesData.map((dictionary) => (
          <div
            key={dictionary.id}
            className="flex justify-between items-center"
          >
            <Button
              onClick={() => onSelect(dictionary)}
              variant="ghost"
              className={cn(
                "w-full flex justify-start items-center hover:bg-neutral-900/10",
                activeDictionaryId === dictionary.id && "bg-neutral-900/5",
              )}
            >
              <LuBookA /> {dictionary.title}
              <span className="ml-auto text-xs text-neutral-400">
                {dictionary.entries?.length ?? 0}
              </span>
            </Button>
          </div>
        ))}
    </>
  );
};
