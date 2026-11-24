"use client";

import { FC, ReactNode } from "react";
import { IconType } from "react-icons";
import { LuBookMarked, LuCalendarClock, LuCircleDashed, LuShapes } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { MaterialStatusEnum, MaterialTypeEnum } from "@/entities/material";
import { MaterialStatus, MaterialType } from "@/features/material/update-material";

const Property: FC<{ icon: IconType; label: string; children: ReactNode }> = ({ icon: Icon, label, children }) => (
  <div className="flex min-h-9 items-center gap-3">
    <dt className="flex w-24 shrink-0 items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
      <Icon aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </dt>
    <dd className="min-w-0 flex-1">{children}</dd>
  </div>
);

interface MaterialPropertiesProps {
  id: string;
  type: MaterialTypeEnum;
  status: MaterialStatusEnum;
  // The subjects and the deadline, put in by the page
  subjects: ReactNode;
  deadline: ReactNode;
}

// Everything about a material that is set rather than written, named and in one place
export const MaterialProperties: FC<MaterialPropertiesProps> = ({ id, type, status, subjects, deadline }) => {
  const { t } = useTranslation();

  return (
    <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
      <Property icon={LuShapes} label={t("materials.typeLabel")}>
        <MaterialType id={id} type={type} />
      </Property>
      <Property icon={LuCircleDashed} label={t("materials.statusLabel")}>
        <MaterialStatus id={id} materialStatus={status} showLabel={false} />
      </Property>
      <Property icon={LuBookMarked} label={t("tags.label")}>
        {subjects}
      </Property>
      <Property icon={LuCalendarClock} label={t("deadline.title")}>
        {deadline}
      </Property>
    </dl>
  );
};
