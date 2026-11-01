// SHARED-UI
"use client";

import { FC, ReactNode } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/radix-ui/Button/button";
import { cn } from "@/shared/lib/cn";
import { Spinner } from "../IsPendingLoader";
import { Modal } from "./modal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText: ReactNode;
  pending?: boolean;
  // danger: deleting and other steps that can't be undone
  tone?: "danger" | "ai" | "neutral";
  icon?: ReactNode;
}

// "Are you sure?" in one shape everywhere: what happens, Cancel on the left, the action on the right
export const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  pending,
  tone = "danger",
  icon,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      tone={tone}
      icon={icon ?? (tone === "danger" ? <LuTrash2 /> : undefined)}
      title={title}
      description={description}
      footer={
        <>
          <Button size="lg" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            size="lg"
            variant={tone === "danger" ? "destructive" : "default"}
            className={cn(tone === "ai" && "bg-violet-700 text-white hover:bg-violet-800")}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending && <Spinner />}
            {confirmText}
          </Button>
        </>
      }
    />
  );
};
