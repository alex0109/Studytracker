"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { SaveStatus, TitleInput } from "@/shared/ui";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialTitleProps {
  id: string;
  title: string;
}

// Same limit as the database column
const MAX_TITLE = 70;

export const MaterialTitle: FC<MaterialTitleProps> = ({ id, title }) => {
  const { t } = useTranslation();
  const [titleValue, setTitleValue] = useState(title);

  const { updateMaterial, updateMaterialIsPending, updateMaterialIsError } =
    useMaterialUpdate(id);

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  // The field stays editable while it saves: disabling it threw the cursor out mid-word
  useEffect(() => {
    if (title !== debouncedTitleValue && debouncedTitleValue.trim()) {
      updateMaterial({ id, dataToUpdate: { title: debouncedTitleValue } });
    }
  }, [id, title, debouncedTitleValue, updateMaterial]);

  return (
    <div className="relative w-full">
      <TitleInput
        value={titleValue}
        onChange={setTitleValue}
        maxLength={MAX_TITLE}
        ariaLabel={t("materials.titleLabel")}
      />
      <SaveStatus
        isPending={updateMaterialIsPending}
        isError={updateMaterialIsError}
        className="absolute top-1/2 right-1 -translate-y-1/2"
      />
    </div>
  );
};
