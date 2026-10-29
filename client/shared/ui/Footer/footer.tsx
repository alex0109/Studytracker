// SHARED-UI
"use client";

import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-30 px-4 mt-10 text-center text-neutral-200 bg-neutral-800 dark:bg-neutral-900 dark:border-t dark:border-neutral-800">
      <small className="mb-2 block text-sm">
        &copy; 2026 Oleksii Slipokurov. {t("footer.rights")}
      </small>
    </footer>
  );
};
