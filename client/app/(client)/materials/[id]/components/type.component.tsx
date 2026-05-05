import { MaterialTypeEnum } from "@/app/types/types";
import React, { FC, useState } from "react";

interface MaterialTypeType {
  id: string;
  type: MaterialTypeEnum;
  updateTypeHandler: (id: string, type: MaterialTypeEnum) => void;
}

const MaterialType: FC<MaterialTypeType> = ({
  id,
  type,
  updateTypeHandler,
}) => {
  const [selectType, setSelectType] = useState<MaterialTypeEnum>(type);

  const onTypeUpdate = (id: string, newType: MaterialTypeEnum) => {
    setSelectType(newType);
    updateTypeHandler(id, type);
  };

  return (
    <select
      className="outline-none cursor-pointer text-black dark:text-white"
      value={selectType}
      onChange={(e) => onTypeUpdate(id, e.target.value as MaterialTypeEnum)}
    >
      <option value="article">Article</option>
      <option value="video">Video</option>
      <option value="summary">Summary</option>
      <option value="practice">Practice</option>
      <option value="test">Test</option>
    </select>
  );
};

export default MaterialType;
