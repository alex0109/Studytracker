"use client";

import { FC, FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuMailCheck, LuShieldAlert, LuTrash2 } from "react-icons/lu";
import { Modal } from "@/shared/ui";
import { Button, Input } from "@/shared/radix-ui";
import { useSession } from "@/shared/context/session.provider";
import { useTranslation } from "@/shared/i18n";
import { useAccountDelete } from "../hooks/useAccountDelete";
import { useReauth } from "../hooks/useReauth";

// The red button waits a moment, so a quick double click can't delete the account
const DELAY_SECONDS = 3;

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { user } = useSession();
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(DELAY_SECONDS);
  const [needsReauth, setNeedsReauth] = useState(false);
  const { deleteAccount, deleteAccountIsPending } = useAccountDelete(() => setNeedsReauth(true));
  const { reauth, reauthState, isGoogle } = useReauth();

  // Every opening starts the wait again
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSecondsLeft(DELAY_SECONDS);
  }

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setSecondsLeft((left) => Math.max(0, left - 1)), 1000);
    return () => clearInterval(timer);
  }, [open]);

  const matches =
    !!user?.email && email.trim().toLowerCase() === user.email.toLowerCase();
  const canDelete = matches && secondsLeft === 0 && !deleteAccountIsPending;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canDelete) deleteAccount(email.trim());
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex w-[min(24rem,calc(100vw-4rem))] flex-col gap-4">
        <AnimatePresence mode="wait" initial={false}>
          {needsReauth ? (
            <motion.div
              key="reauth"
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {reauthState === "sent" ? <LuMailCheck size={22} /> : <LuShieldAlert size={22} />}
              </span>
              <h2 className="text-lg font-semibold">
                {reauthState === "sent" ? t("account.delete.reauthSent") : t("account.delete.reauthTitle")}
              </h2>
              <p className="text-sm text-neutral-500">
                {reauthState === "sent"
                  ? t("account.delete.reauthSentText", { email: user?.email })
                  : t("account.delete.reauthText")}
              </p>
              {reauthState === "error" && (
                <p className="text-sm text-red-500">{t("account.delete.reauthError")}</p>
              )}
              {reauthState !== "sent" && (
                <Button onClick={reauth} disabled={reauthState === "pending"}>
                  {isGoogle ? t("account.delete.reauthGoogle") : t("account.delete.reauthEmail")}
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="confirm"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <LuTrash2 size={18} aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{t("account.delete.title")}</h2>
                  <p className="text-sm text-neutral-500">{t("account.delete.subtitle")}</p>
                </div>
              </div>

              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
                <li>{t("account.delete.consequenceData")}</li>
                <li>{t("account.delete.consequenceLibrary")}</li>
                <li>{t("account.delete.consequenceFinal")}</li>
              </ul>

              <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm">
                <span className="text-neutral-600 dark:text-neutral-300">
                  {t("account.delete.typeEmail", { email: user?.email })}
                </span>
                <Input
                  id={inputId}
                  type="email"
                  autoComplete="off"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={user?.email ?? ""}
                  className="h-10 rounded-xl"
                />
              </label>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={onClose}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" variant="destructive" disabled={!canDelete}>
                  {deleteAccountIsPending
                    ? t("account.delete.pending")
                    : secondsLeft > 0
                      ? t("account.delete.waitButton", { count: secondsLeft })
                      : t("account.delete.button")}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
