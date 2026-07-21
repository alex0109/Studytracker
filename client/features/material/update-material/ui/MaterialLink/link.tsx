"use client";

import { FC, useEffect, useState } from "react";
import { Subtitle } from "@/shared/ui";
import { Input } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialLinkType {
  id: string;
  link: string | undefined;
}

export const MaterialLink: FC<MaterialLinkType> = ({ id, link }) => {
  const [linkValue, setLinkValue] = useState(link || "");

  const { updateMaterial } = useMaterialUpdate(id);

  const updateLinkHandler = (materialId: string, link: string): void => {
    updateMaterial({ id: materialId, dataToUpdate: { link } });
  };

  const debouncedLinkValue = useDebounce(linkValue, 1500);

  useEffect(() => {
    if (link !== debouncedLinkValue) {
      updateLinkHandler(id, debouncedLinkValue);
    }
  }, [id, link, debouncedLinkValue]);

  const onLinkUpdate = (newLink: string) => {
    setLinkValue(newLink);
  };

  return (
    <div className="flex items-center w-full gap-2 border-b border-b-neutral-700">
      <Subtitle text="Link:" />
      <Input value={linkValue} onChange={(e) => onLinkUpdate(e.target.value)} />
    </div>
  );
};
