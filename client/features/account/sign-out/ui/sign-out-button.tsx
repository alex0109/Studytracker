"use client";

import { FC, useState, useTransition } from "react";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "@/entities/auth";
import { useSession } from "@/shared/context/session.provider";
import { ConfirmModal } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";

interface SignOutButtonProps {
  // icon: the round button of the top bar; row: a line of the phone menu; button: on a page
  variant?: "icon" | "row" | "button";
  className?: string;
}

export const SignOutButton: FC<SignOutButtonProps> = ({ variant = "button", className }) => {
  const { t } = useTranslation();
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // The dialog stays with a spinner until the redirect: there is nothing to press twice
  const confirm = () =>
    startTransition(async () => {
      await signOut();
    });

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          aria-label={t("nav.signOut")}
          title={t("nav.signOut")}
          onClick={() => setOpen(true)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition",
            "hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-950/40 dark:hover:text-red-400",
            className,
          )}
        >
          <LuLogOut aria-hidden className="size-[1.1rem]" />
        </button>
      ) : variant === "row" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn("flex w-full items-center justify-center gap-2 px-3 py-3 font-medium text-red-500", className)}
        >
          <LuLogOut aria-hidden />
          {t("nav.signOut")}
        </button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn("text-red-600 hover:text-red-700 dark:text-red-400", className)}
        >
          <LuLogOut aria-hidden />
          {t("nav.signOut")}
        </Button>
      )}

      <ConfirmModal
        open={open}
        onClose={() => !pending && setOpen(false)}
        onConfirm={confirm}
        pending={pending}
        icon={<LuLogOut />}
        title={t("nav.signOutConfirm")}
        description={user?.email}
        confirmText={t("nav.signOut")}
      />
    </>
  );
};
