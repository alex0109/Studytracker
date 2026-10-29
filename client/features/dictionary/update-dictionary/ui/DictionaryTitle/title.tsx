"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { SaveStatus, TitleInput } from "@/shared/ui";
import { useDictionaryUpdate } from "../../hooks/useDictionaryUpdate";

interface DictionaryTitleProps {
  dictionaryId: string;
  title: string;
}

export const DictionaryTitle: FC<DictionaryTitleProps> = ({
  dictionaryId,
  title,
}) => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState(title);

  const {
    updateDictionary,
    updateDictionaryIsPending,
    updateDictionaryIsError,
  } = useDictionaryUpdate(dictionaryId);

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue && debouncedTitleValue.trim()) {
      updateDictionary({ dataToUpdate: { title: debouncedTitleValue.trim() } });
    }
  }, [dictionaryId, title, debouncedTitleValue, updateDictionary]);

  return (
    <div className="flex flex-col w-full gap-1 justify-center items-center">
      <div className="relative w-full">
        <TitleInput
          value={titleValue}
          onChange={setTitleValue}
          maxLength={70}
          ariaLabel={t("materials.titleLabel")}
        />
        <SaveStatus
          isPending={updateDictionaryIsPending}
          isError={updateDictionaryIsError}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        />
      </div>
      <p className="text-xs text-neutral-500">{dictionaryId.split("-")[0]}</p>
    </div>
  );
};
