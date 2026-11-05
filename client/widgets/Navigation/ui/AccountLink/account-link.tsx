"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuUserRound } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

// Round like the language and theme buttons next to it
export const AccountLink: FC = () => {
  const { t } = useTranslation();
  const active = usePathname() === "/account";

  return (
    <Link
      href="/account"
      aria-label={t("nav.account")}
      title={t("nav.account")}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-800 shadow-sm backdrop-blur transition-colors hover:bg-neutral-100",
        "dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-800",
        active && "border-neutral-900 dark:border-neutral-100",
      )}
    >
      <LuUserRound aria-hidden />
    </Link>
  );
};
