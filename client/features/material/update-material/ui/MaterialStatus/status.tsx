"use client";

import { FC, useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { LuChevronDown } from "react-icons/lu";
import { MATERIAL_STATUSES, MaterialStatusEnum, STATUS_LOOK } from "@/entities/material";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { useDebounce } from "@/shared/hooks";
import { SaveStatus, SelectMenu, Subtitle } from "@/shared/ui";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialStatusProps {
  id: string;
  materialStatus: MaterialStatusEnum;
  // A list of properties names the field itself
  showLabel?: boolean;
}

const SPARKS = Array.from({ length: 8 }, (_, index) => (index / 8) * Math.PI * 2);

// A few dots flying out of the badge when a material is finished
const Sparks = () => (
  <span aria-hidden className="pointer-events-none absolute inset-0">
    {SPARKS.map((angle, index) => (
      <motion.span
        key={index}
        className="absolute top-1/2 left-1/2 size-1.5 rounded-full bg-emerald-400"
        initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
        animate={{
          x: `calc(-50% + ${Math.round(Math.cos(angle) * 78)}px)`,
          y: `calc(-50% + ${Math.round(Math.sin(angle) * 34)}px)`,
          opacity: 0,
          scale: 0.3,
        }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      />
    ))}
  </span>
);

export const MaterialStatus: FC<MaterialStatusProps> = ({
  id,
  materialStatus,
  showLabel = true,
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const badge = useAnimationControls();
  const [statusValue, setStatusValue] =
    useState<MaterialStatusEnum>(materialStatus);
  const [sparks, setSparks] = useState(0);

  const { updateMaterial, updateMaterialIsPending, updateMaterialIsError } =
    useMaterialUpdate(id);

  const debouncedStatusValue = useDebounce(statusValue, 1500);

  useEffect(() => {
    if (materialStatus !== debouncedStatusValue) {
      updateMaterial({ id, dataToUpdate: { status: debouncedStatusValue } });
    }
  }, [id, materialStatus, debouncedStatusValue, updateMaterial]);

  // The badge is animated in place, not re-created, so the select keeps keyboard focus
  const onUpdateStatus = (newStatus: MaterialStatusEnum) => {
    setStatusValue(newStatus);
    void badge.start({ scale: [1, 1.08, 1], transition: { duration: 0.3 } });
    if (newStatus === "finished" && !reduceMotion) setSparks((value) => value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && <Subtitle text={`${t("materials.statusLabel")}:`} />}
      <motion.span
        animate={badge}
        className={cn(
          "relative inline-flex items-center rounded-full border text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-neutral-300 dark:focus-within:ring-neutral-600",
          STATUS_LOOK[statusValue].pill,
        )}
      >
        {/* Bound to the state, so the current status is shown, not the first option */}
        <SelectMenu
          value={statusValue}
          aria-label={t("materials.statusLabel")}
          triggerClassName="rounded-full bg-transparent py-1 pr-2.5 pl-3 outline-none"
          onValueChange={(next) => onUpdateStatus(next as MaterialStatusEnum)}
          options={MATERIAL_STATUSES.map((status) => ({
            value: status,
            label: (
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className={cn("size-2 rounded-full", STATUS_LOOK[status].dot)} />
                {t(`materials.statuses.${status}`)}
              </span>
            ),
          }))}
          // The chevron turns into the saving spinner and the saved check
          icon={
            <SaveStatus
              isPending={updateMaterialIsPending}
              isError={updateMaterialIsError}
              idle={<LuChevronDown aria-hidden className="size-3.5 opacity-60" />}
            />
          }
        />
        {sparks > 0 && <Sparks key={sparks} />}
      </motion.span>
    </div>
  );
};
