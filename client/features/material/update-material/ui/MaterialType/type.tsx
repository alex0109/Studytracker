"use client";

import { FC, useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { MATERIAL_TYPES, MaterialTypeEnum } from "@/entities/material";
import { useTranslation } from "@/shared/i18n";
import { useDebounce } from "@/shared/hooks";
import { SaveStatus, SelectMenu } from "@/shared/ui";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialTypeProps {
  id: string;
  type: MaterialTypeEnum;
}

// A small pill in the material's meta line, the native select keeps keyboard and phone pickers
export const MaterialType: FC<MaterialTypeProps> = ({ id, type }) => {
  const { t } = useTranslation();
  const [selectType, setSelectType] = useState<MaterialTypeEnum>(type);

  const { updateMaterial, updateMaterialIsPending, updateMaterialIsError } =
    useMaterialUpdate(id);

  const debouncedTypeValue = useDebounce(selectType, 500);

  useEffect(() => {
    if (type !== debouncedTypeValue) {
      updateMaterial({ id, dataToUpdate: { type: debouncedTypeValue } });
    }
  }, [id, type, debouncedTypeValue, updateMaterial]);

  return (
    <span className="relative inline-flex items-center rounded-full border border-neutral-200 bg-white/70 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-white focus-within:ring-2 focus-within:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus-within:ring-neutral-600">
      <SelectMenu
        aria-label={t("materials.typeLabel")}
        triggerClassName="rounded-full bg-transparent py-1 pr-2.5 pl-3 outline-none"
        value={selectType}
        onValueChange={(next) => setSelectType(next as MaterialTypeEnum)}
        options={MATERIAL_TYPES.map((item) => ({ value: item, label: t(`materials.types.${item}`) }))}
        // The chevron turns into the saving spinner and the saved check
        icon={
          <SaveStatus
            isPending={updateMaterialIsPending}
            isError={updateMaterialIsError}
            idle={<LuChevronDown aria-hidden className="size-3.5 text-neutral-400" />}
          />
        }
      />
    </span>
  );
};
