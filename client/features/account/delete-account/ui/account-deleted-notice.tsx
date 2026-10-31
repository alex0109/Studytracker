"use client";

import { FC, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { DELETED_PARAM } from "../hooks/useAccountDelete";

// Shown once on the home page after the account is gone
export const AccountDeletedNotice: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Once per visit, also when effects run twice in development
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current || searchParams?.get(DELETED_PARAM) !== "1") return;
    shown.current = true;
    toast({
      title: t("account.delete.doneTitle"),
      description: t("account.delete.doneText"),
      variant: "success",
      durationMs: 10000,
    });
    router.replace(pathname ?? "/", { scroll: false });
  }, [searchParams, router, pathname, t]);

  return null;
};
