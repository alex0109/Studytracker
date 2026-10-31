"use client";

import { FC, RefObject, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LuBookPlus } from "react-icons/lu";
import { SelectionAction, TextSelectionInfo } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { IDictionaryResponse } from "@/entities/dictionary";
import { AddWordPanel } from "./add-word-panel";

interface AddFromSelectionProps {
  materialId: string;
  // The text to watch: the material's editor or a note
  containerRef: RefObject<HTMLElement | null>;
  onOpenDictionary?: (dictionary: IDictionaryResponse) => void;
}

// Reading loop: select a word or a short phrase, get it into a dictionary of this material
// with the sentence as its example
export const AddFromSelection: FC<AddFromSelectionProps> = ({ materialId, containerRef, onOpenDictionary }) => {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<TextSelectionInfo | null>(null);
  const close = useCallback(() => setPicked(null), []);

  return (
    <>
      <SelectionAction
        containerRef={containerRef}
        label={t("dictionary.fromReading.button")}
        icon={<LuBookPlus aria-hidden />}
        hidden={!!picked}
        onPick={setPicked}
      />
      <AnimatePresence>
        {picked && (
          <AddWordPanel
            key={`${picked.text}:${picked.rect.top}`}
            materialId={materialId}
            selection={picked}
            onClose={close}
            onOpenDictionary={onOpenDictionary}
          />
        )}
      </AnimatePresence>
    </>
  );
};
