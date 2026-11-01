"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import { LuMailCheck, LuShieldAlert, LuTrash2 } from "react-icons/lu";
import { Field, FieldInput, Modal, Spinner } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
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

  if (needsReauth) {
    const sent = reauthState === "sent";

    return (
      <Modal
        open={open}
        onClose={onClose}
        icon={sent ? <LuMailCheck /> : <LuShieldAlert />}
        tone="warning"
        title={sent ? t("account.delete.reauthSent") : t("account.delete.reauthTitle")}
        description={
          sent ? t("account.delete.reauthSentText", { email: user?.email }) : t("account.delete.reauthText")
        }
        footer={
          sent ? (
            <Button size="lg" variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>
          ) : (
            <>
              <Button size="lg" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button size="lg" onClick={reauth} disabled={reauthState === "pending"}>
                {reauthState === "pending" && <Spinner />}
                {isGoogle ? t("account.delete.reauthGoogle") : t("account.delete.reauthEmail")}
              </Button>
            </>
          )
        }
      >
        {reauthState === "error" && (
          <p role="alert" className="text-center text-sm text-red-500">
            {t("account.delete.reauthError")}
          </p>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<LuTrash2 />}
      tone="danger"
      title={t("account.delete.title")}
      description={t("account.delete.subtitle")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button size="lg" type="submit" form="delete-account" variant="destructive" disabled={!canDelete}>
            {deleteAccountIsPending && <Spinner />}
            {deleteAccountIsPending
              ? t("account.delete.pending")
              : secondsLeft > 0
                ? t("account.delete.waitButton", { count: secondsLeft })
                : t("account.delete.button")}
          </Button>
        </>
      }
    >
      <form id="delete-account" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ul className="flex list-disc flex-col gap-1.5 rounded-2xl bg-red-50 py-3 pr-4 pl-8 text-sm text-red-900 dark:bg-red-950/40 dark:text-red-200">
          <li>{t("account.delete.consequenceData")}</li>
          <li>{t("account.delete.consequenceLibrary")}</li>
          <li>{t("account.delete.consequenceFinal")}</li>
        </ul>

        <Field label={t("account.delete.typeEmail", { email: user?.email })}>
          <FieldInput
            type="email"
            autoComplete="off"
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={user?.email ?? ""}
          />
        </Field>
      </form>
    </Modal>
  );
};
