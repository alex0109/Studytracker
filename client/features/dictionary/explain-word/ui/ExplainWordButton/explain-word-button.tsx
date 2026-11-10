"use client";

import { FC, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { IDictionaryEntryResponse } from "@/entities/dictionary";
import { ExplainWordModal } from "../ExplainWordModal/explain-word-modal";

// The window and its request exist only once the button is pressed
export const ExplainWordButton: FC<{ entry: IDictionaryEntryResponse }> = ({ entry }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title={t("dictionary.explain.button")}
        aria-label={t("dictionary.explain.button")}
        onClick={() => {
          setWasOpened(true);
          setOpen(true);
        }}
        className="text-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:text-violet-400 dark:hover:bg-violet-950/40"
      >
        <LuSparkles />
      </Button>
      {wasOpened && <ExplainWordModal entry={entry} open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
