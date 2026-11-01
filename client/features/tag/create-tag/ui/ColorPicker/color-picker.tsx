"use client";

import { FC } from "react";
import { useTranslation } from "@/shared/i18n";
import { colors } from "../../lib/colors";

interface Props {
  value: string;
  onChange: (color: string) => void;
}

// Controlled: the dialog unmounts its content on close, the chosen colour lives with the form
export const ColorPicker: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div role="group" aria-label={t("tags.color")} className="flex flex-col gap-1.5">
      <span aria-hidden className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t("tags.color")}
      </span>

      <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800">
        {colors.map((color) =>
          color.shades.map((shade) => (
            <button
              key={shade}
              type="button"
              onClick={() => onChange(shade)}
              aria-label={shade}
              aria-pressed={value === shade}
              className={`w-8 h-8 rounded-full border-3 transition ${
                value === shade
                  ? "border-neutral-600 scale-110 dark:border-neutral-200"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: shade,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};
