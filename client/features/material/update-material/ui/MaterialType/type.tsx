"use client";

import { FC, useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { MATERIAL_TYPES, MaterialTypeEnum } from "@/entities/material";
import { useTranslation } from "@/shared/i18n";
import { useDebounce } from "@/shared/hooks";
import { SaveStatus } from "@/shared/ui";
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
      <select
        aria-label={t("materials.typeLabel")}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pr-8 pl-3 outline-none [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-900 dark:[&>option]:text-white"
        value={selectType}
        onChange={(e) => setSelectType(e.target.value as MaterialTypeEnum)}
      >
        {MATERIAL_TYPES.map((item) => (
          <option key={item} value={item}>
            {t(`materials.types.${item}`)}
          </option>
        ))}
      </select>
      {/* The chevron turns into the saving spinner and the saved check */}
      <SaveStatus
        isPending={updateMaterialIsPending}
        isError={updateMaterialIsError}
        className="pointer-events-none absolute right-2"
        idle={<LuChevronDown aria-hidden className="size-3.5 text-neutral-400" />}
      />
    </span>
  );
};
