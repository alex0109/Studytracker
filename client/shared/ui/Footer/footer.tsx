// SHARED-UI
"use client";

import { FC } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GA_MEASUREMENT_ID, OPEN_CONSENT_EVENT } from "@/shared/lib/analytics";

export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-30 px-4 mt-10 text-center text-neutral-200 bg-neutral-800 dark:bg-neutral-900 dark:border-t dark:border-neutral-800">
      <small className="mb-2 block text-sm">
        &copy; 2026 Oleksii Slipokurov. {t("footer.rights")}
      </small>
      <nav className="mt-3 flex justify-center gap-4 text-sm text-neutral-400">
        <Link href="/privacy" className="hover:text-neutral-100">
          {t("footer.privacy")}
        </Link>
        {/* The analytics choice can be changed at any time */}
        {GA_MEASUREMENT_ID && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
            className="hover:text-neutral-100"
          >
            {t("footer.cookies")}
          </button>
        )}
      </nav>
    </footer>
  );
};
