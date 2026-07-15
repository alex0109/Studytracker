"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialTitleType {
  id: string;
  title: string;
}

export const MaterialTitle: FC<MaterialTitleType> = ({ id, title }) => {
  const [titleValue, setTitleValue] = useState(title);

  const { updateMaterial } = useMaterialUpdate(id);

  const updateTitleHandler = (materialId: string, title: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { title } });
  };

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue) {
      updateTitleHandler(id, debouncedTitleValue);
    }
  }, [id, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <Input
      className="focus:outline-none text-center text-2xl font-bold border-0"
      value={titleValue}
      onChange={(e) => onUpdateTitle(e.target.value)}
      maxLength={30}
    />
  );
};
