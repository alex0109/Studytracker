import { FC, useEffect, useState } from "react";
import { MaterialTypeEnum } from "@/entities/material";
import { useDebounce } from "@/shared/hooks";
import useMaterialUpdate from "../../hooks/useMaterialUpdate";

interface MaterialTypeType {
  id: string;
  type: MaterialTypeEnum;
}

export const MaterialType: FC<MaterialTypeType> = ({ id, type }) => {
  const [selectType, setSelectType] = useState<MaterialTypeEnum>(type);

  const { updateMaterial } = useMaterialUpdate(id);

  const updateTypeHandler = (
    materialId: string,
    type: MaterialTypeEnum,
  ): void => {
    updateMaterial({ id: materialId, dataToUpdate: { type } });
  };

  const debouncedTypeValue = useDebounce(selectType, 1500);

  useEffect(() => {
    if (type !== debouncedTypeValue) {
      updateTypeHandler(id, debouncedTypeValue);
    }
  }, [id, type, debouncedTypeValue]);

  const onTypeUpdate = (id: string, newType: MaterialTypeEnum) => {
    setSelectType(newType);
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
