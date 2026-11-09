"use client";

import { FC } from "react";
import { ChoiceGroup, FieldInput } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { CUSTOM, NONE } from "../../hooks/useNumberSetting";

interface NumberChoiceProps {
  label: string;
  noneLabel: string;
  presets: readonly number[];
  choice: string;
  onChoice: (choice: string) => void;
  customText: string;
  onCustomText: (text: string) => void;
  min: number;
  max: number;
  // Next to the typed number: "of 42", "min"
  unit: string;
  // Presets above it can't be had (more questions than there are)
  available?: number;
  error?: string;
}

// A row of quick choices; "Custom" opens a field for a number of one's own
export const NumberChoice: FC<NumberChoiceProps> = ({
  label,
  noneLabel,
  presets,
  choice,
  onChoice,
  customText,
  onCustomText,
  min,
  max,
  unit,
  available,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <ChoiceGroup
        label={label}
        value={choice}
        onChange={onChoice}
        options={[
          { value: NONE, label: noneLabel },
          ...presets.map((preset) => ({
            value: String(preset),
            label: preset,
            disabled: available !== undefined && preset > available,
          })),
          { value: CUSTOM, label: t("exam.custom") },
        ]}
      />
      {choice === CUSTOM && (
        <div className="flex items-center gap-2">
          <FieldInput
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={customText}
            aria-label={label}
            aria-invalid={!!error}
            autoFocus
            onChange={(event) => onCustomText(event.target.value)}
            className="w-24"
          />
          <span className="text-sm text-neutral-500">{unit}</span>
        </div>
      )}
      {error && (
        <span role="alert" className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};
