"use client";

import { FC } from "react";
import { LuLogIn } from "react-icons/lu";
import { Modal } from "@/shared/ui";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

interface SessionExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

// Not a redirect on its own: the user may have unsaved text in front of them and should be able
// to copy it first. "Later" closes it, the next refused request opens it again
export const SessionExpiredModal: FC<SessionExpiredModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const signIn = () => {
    const back = `${window.location.pathname}${window.location.search}`;
    const signInUrl = new URL("/sign-in", window.location.origin);
    signInUrl.searchParams.set("redirect", back);
    // A full load, not router.push: the layout above still holds the old user and has to be
    // rendered again by the server
    window.location.assign(signInUrl.href);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<LuLogIn />}
      tone="warning"
      title={t("auth.sessionExpired.title")}
      description={t("auth.sessionExpired.text")}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={onClose}>
            {t("auth.sessionExpired.later")}
          </Button>
          <Button size="lg" onClick={signIn}>
            {t("auth.sessionExpired.signIn")}
          </Button>
        </>
      }
    />
  );
};
