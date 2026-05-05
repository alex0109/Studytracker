import EditableLink from "@/shared/components/editable-link";
import Subtitle from "@/shared/components/subtitle";
import React, { FC, useState } from "react";

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
  const [linkValue, setLinkValue] = useState(link);

  const onLinkUpdate = (id: string, newLink: string) => {
    setLinkValue(newLink);
    updateLinkHandler(id, newLink);
  };

  return (
    <div className="flex items-center w-full gap-2 border-b border-b-neutral-700">
      <Subtitle text="Link:" />
      <EditableLink initialValue={linkValue ?? ""} onChange={onLinkUpdate} />
    </div>
  );
};

export default MaterialLink;
