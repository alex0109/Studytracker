// SHARED-UI
"use client";

import { FC, ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ open, onClose, children }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClose}
      className={`z-50 fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/50" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`z-50 bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute top-2 right-2 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <LuX aria-hidden />
        </button>
        {children}
      </div>
    </div>
  );
};
