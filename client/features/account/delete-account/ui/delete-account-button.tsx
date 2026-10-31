"use client";

import { FC, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { DeleteAccountModal } from "./delete-account-modal";

export const DeleteAccountButton: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Back from the second sign in: the dialog opens again, and the flag leaves the address
  const backFromReauth = searchParams?.get("delete") === "1";
  const [open, setOpen] = useState(backFromReauth);

  useEffect(() => {
    if (backFromReauth) router.replace(pathname ?? "/account", { scroll: false });
  }, [backFromReauth, router, pathname]);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)} className="self-start">
        <LuTrash2 aria-hidden /> {t("account.delete.open")}
      </Button>
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
