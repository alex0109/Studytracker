"use client";

import { FC } from "react";
import { LuDownload } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { useAccountExport } from "../hooks/useAccountExport";

export const ExportAccountButton: FC = () => {
  const { t } = useTranslation();
  const { exportAccount, exportAccountIsPending } = useAccountExport();

  return (
    <Button
      variant="outline"
      disabled={exportAccountIsPending}
      onClick={() => exportAccount()}
      className="self-start"
    >
      <LuDownload aria-hidden className={exportAccountIsPending ? "animate-bounce" : undefined} />
      {exportAccountIsPending ? t("account.export.pending") : t("account.export.button")}
    </Button>
  );
};
