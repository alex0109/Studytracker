import Subtitle from "@/shared/components/subtitle";
import { Input } from "@/shared/components/ui/input";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import React, { FC, useEffect, useState } from "react";

interface MaterialLinkType {
  id: string;
  link: string | undefined;
  updateLinkHandler: (id: string, link: string) => void;
}

const MaterialLink: FC<MaterialLinkType> = ({
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

export default MaterialLink;
