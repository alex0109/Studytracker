"use client";

import { useTranslation } from "@/shared/i18n";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { IsPendingLoader } from "@/shared/ui";
import { useDictionaryUpdate } from "../../hooks/useDictionaryUpdate";

interface DictionaryDescriptionProps {
  dictionaryId: string;
  description?: string;
}

export const DictionaryDescription: FC<DictionaryDescriptionProps> = ({
  dictionaryId,
  description,
}) => {
  const { t } = useTranslation();
  const [descriptionValue, setDescriptionValue] = useState(description ?? "");

  const { updateDictionary, updateDictionaryIsPending } =
    useDictionaryUpdate(dictionaryId);

  const debouncedDescriptionValue = useDebounce(descriptionValue, 1500);

  useEffect(() => {
    if ((description ?? "") !== debouncedDescriptionValue) {
      updateDictionary({
        dataToUpdate: { description: debouncedDescriptionValue },
      });
    }
  }, [dictionaryId, description, debouncedDescriptionValue]);

  return (
    <div className="flex w-full justify-center items-start gap-2 mt-2">
      <textarea
        value={descriptionValue}
        placeholder={t("dictionary.descriptionAdd")}
        aria-label={t("dictionary.description")}
        className="w-full max-w-[600px] min-h-[40px] text-center text-neutral-500 border-0 resize-none
                  wrap-break-word outline-none bg-transparent"
        onChange={(e) => setDescriptionValue(e.target.value)}
        maxLength={500}
      />
      <div className="w-9">
        <IsPendingLoader isPending={updateDictionaryIsPending} />
      </div>
    </div>
  );
};
