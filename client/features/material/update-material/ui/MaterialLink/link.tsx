"use client";

import { FC, useEffect, useState } from "react";
import { Subtitle } from "@/shared/ui";
import { Input } from "@/shared/radix-ui";
import { useDebounce } from "@/shared/hooks";

interface MaterialLinkType {
  id: string;
  link: string | undefined;
  updateLinkHandler: (id: string, link: string) => void;
}

export const MaterialLink: FC<MaterialLinkType> = ({
  id,
  link,
  updateLinkHandler,
}) => {
  const [linkValue, setLinkValue] = useState(link || "");

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
