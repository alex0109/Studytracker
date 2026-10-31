"use client";

import { FC } from "react";
import { MaterialStatusEnum } from "@/entities/material/model";
import { useIsMobile } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";

interface StatusBadgeProps {
  status: MaterialStatusEnum | undefined;
  size?: "normal" | "mini";
  isListed?: boolean;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  size = "normal",
  isListed,
}) => {
  const { t } = useTranslation();
  const mobile = useIsMobile();
  const label = status ? t(`materials.statuses.${status}`) : t("errors.unknown");

  if (mobile && isListed) {
    return (
      <div
        className={`w-[20px] h-[20px] p-2 rounded-2xl text-white text-center ${
          status == "tolearn"
            ? "bg-sky-500"
            : status == "inprocess"
              ? "bg-purple-500"
              : status == "finished"
                ? "bg-emerald-500"
                : "bg-neutral-500"
        }`}
      />
    );
  }

  return size == "mini" ? (
    <p
      className={`${
        status == "tolearn"
          ? "text-sky-500"
          : status == "inprocess"
            ? "text-purple-500"
            : status == "finished"
              ? "text-emerald-500"
              : "text-neutral-500"
      }`}
    >
      {label}
    </p>
  ) : (
    <div
      className={`w-[130px] p-2 rounded-2xl text-white text-center ${
        status == "tolearn"
          ? "bg-sky-500"
          : status == "inprocess"
            ? "bg-purple-500"
            : status == "finished"
              ? "bg-emerald-500"
              : "bg-neutral-500"
      }`}
    >
      <p>{label}</p>
    </div>
  );
};
