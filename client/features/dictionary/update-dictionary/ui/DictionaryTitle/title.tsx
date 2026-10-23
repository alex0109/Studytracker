"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";
import { useDictionaryUpdate } from "../../hooks/useDictionaryUpdate";

interface DictionaryTitleProps {
  dictionaryId: string;
  title: string;
}

export const DictionaryTitle: FC<DictionaryTitleProps> = ({
  dictionaryId,
  title,
}) => {
  const [titleValue, setTitleValue] = useState(title);

  const { updateDictionary } = useDictionaryUpdate(dictionaryId);

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue && debouncedTitleValue.trim()) {
      updateDictionary({ dataToUpdate: { title: debouncedTitleValue.trim() } });
    }
  }, [dictionaryId, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <div className="flex flex-col w-full gap-2 justify-center items-center">
      <div className="flex-1 w-full">
        <Input
          className="focus:outline-none text-center text-2xl font-bold border-0"
          value={titleValue}
          onChange={(e) => onUpdateTitle(e.target.value)}
          maxLength={70}
        />
      </div>
      <div>
        <p className="text-xs text-neutral-500">{dictionaryId.split("-")[0]}</p>
      </div>
    </div>
  );
};
