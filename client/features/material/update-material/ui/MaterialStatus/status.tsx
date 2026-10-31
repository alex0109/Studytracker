"use client";

import { FC, useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  MATERIAL_STATUSES,
  MaterialStatusEnum,
  StatusBadgeSelect,
} from "@/entities/material";
import { useTranslation } from "@/shared/i18n";
import { useDebounce } from "@/shared/hooks";
import { SaveStatus, Subtitle } from "@/shared/ui";
import { useMaterialUpdate } from "../../hooks/useMaterialUpdate";

interface MaterialStatusProps {
  id: string;
  materialStatus: MaterialStatusEnum;
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
      <Subtitle text={`${t("materials.statusLabel")}:`} />
      <motion.span animate={badge} className="relative inline-flex">
        <StatusBadgeSelect status={statusValue}>
          {/* Bound to the state, so the current status is shown, not the first option */}
          <select
            value={statusValue}
            aria-label={t("materials.statusLabel")}
            className="text-white bg-transparent outline-none cursor-pointer [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-900 dark:[&>option]:text-white"
            onChange={(e) =>
              onUpdateStatus(e.target.value as MaterialStatusEnum)
            }
          >
            {MATERIAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`materials.statuses.${status}`)}
              </option>
            ))}
          </select>
        </StatusBadgeSelect>
        {sparks > 0 && <Sparks key={sparks} />}
      </motion.span>
      <SaveStatus isPending={updateMaterialIsPending} isError={updateMaterialIsError} />
    </div>
  );
};
