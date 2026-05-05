import EditableField from "@/shared/components/editable-field";
import useDebounce from "@/shared/hooks/use-debounce.hook";
import React, { FC, useState } from "react";

interface MaterialTitleType {
  id: string;
  title: string;
  updateTitleHandler: (id: string, title: string) => void;
}

const MaterialTitle: FC<MaterialTitleType> = ({
  id,
  title,
  updateTitleHandler,
}) => {
  const [titleValue, setTitleValue] = useState(title);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
    return useDebounce(() => updateTitleHandler(id, titleValue), 500);
  };

  return (
    <EditableField
      initialValue={titleValue}
      titleHeading
      maxLength={20}
      onInput={() => onUpdateTitle}
    />
  );
};

export default MaterialTitle;
